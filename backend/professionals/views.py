from typing import Any, Dict, List, Optional, Tuple

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Professional
from .serializers import ProfessionalSerializer


class ProfessionalViewSet(viewsets.ModelViewSet):
    queryset = Professional.objects.all()
    serializer_class = ProfessionalSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        source = self.request.query_params.get("source")
        return queryset.filter(source=source) if source else queryset


class BulkProfessionalView(APIView):

    def _resolve_identity(
        self, item: Dict[str, Any]
    ) -> Tuple[Optional[Professional], Optional[str]]:
        """Resolve an existing Professional and which key was used.
        Uses email first, otherwise phone.
        """
        email = item.get("email")
        phone = item.get("phone")

        if email:
            return Professional.objects.filter(email=email).first(), "email"
        if phone:
            return Professional.objects.filter(phone=phone).first(), "phone"
        return None, None

    def _strip_immutable_identifiers(
        self, instance: Professional, item: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Prevent changing identifiers once set.
        Allows setting email or phone only if the instance field is currently empty.
        """
        update_data = item.copy()

        if instance.email:
            update_data.pop("email", None)
        if instance.phone:
            update_data.pop("phone", None)

        return update_data

    def _conflict_error(
        self,
        instance: Professional,
        key_used: str,
        item: Dict[str, Any],
    ) -> Optional[str]:
        """Return a conflict error message for unsafe merges or identifier mutation."""
        email: Optional[str] = item.get("email")
        phone: Optional[str] = item.get("phone")

        if key_used == "email":
            # If phone is provided and differs from existing phone, block.

            if "company_name" in item and item["company_name"] != instance.company_name:
                return "Duplicate email already exists"

            if phone and instance.phone:
                return "Phone conflict: cannot change phone on existing record"

            # If instance has no phone yet, allow setting phone only if unused elsewhere.
            if phone and not instance.phone:
                if (
                    Professional.objects.filter(phone=phone)
                    .exclude(id=instance.id)
                    .exists()
                ):
                    return "Phone already exists"

        if key_used == "phone":
            # Phone-only payload should not update an identified user
            # Treat presence of email on the existing record as identified.
            if instance.email and not email:
                return "Cannot update identified user via phone-only payload"

            # If setting email for the first time, ensure it's unused elsewhere.
            if email and not instance.email:
                if (
                    Professional.objects.filter(email=email)
                    .exclude(id=instance.id)
                    .exists()
                ):
                    return "Email already exists"

        return None

    def post(self, request, *args, **kwargs):
        """Bulk upsert professionals with partial success.
        Email is primary key, otherwise phone. Returns created, updated, errors.
        """
        data = request.data
        if not isinstance(data, list):
            return Response(
                {"error": "Expected a list of profiles"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created_list: List[Dict[str, Any]] = []
        updated_list: List[Dict[str, Any]] = []
        errors_list: List[Dict[str, Any]] = []

        for index, item in enumerate(data):
            try:
                instance, key_used = self._resolve_identity(item)

                if instance and key_used:
                    conflict = self._conflict_error(instance, key_used, item)
                    if conflict:
                        errors_list.append({"index": index, "reason": conflict})
                        continue

                    update_data = self._strip_immutable_identifiers(instance, item)
                    serializer = ProfessionalSerializer(
                        instance, data=update_data, partial=True
                    )
                else:
                    # Create path: serializer handles "email or phone required" and uniqueness cleanly
                    serializer = ProfessionalSerializer(data=item)

                if not serializer.is_valid():
                    errors_list.append({"index": index, "reason": serializer.errors})
                    continue

                with transaction.atomic():
                    obj = serializer.save()

                if instance:
                    updated_list.append(ProfessionalSerializer(obj).data)
                else:
                    created_list.append(ProfessionalSerializer(obj).data)

            except Exception as exc:
                errors_list.append({"index": index, "reason": str(exc)})

        return Response(
            {"created": created_list, "updated": updated_list, "errors": errors_list},
            status=status.HTTP_200_OK,
        )
