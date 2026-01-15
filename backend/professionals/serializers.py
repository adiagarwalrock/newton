import re
from typing import Any, Dict, Optional

from rest_framework import serializers

from .models import Professional

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PHONE_REGEX = r"^\+?[0-9]{1,4}?[-.\s]?\(?[0-9]{1,3}?\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$"


class ProfessionalSerializer(serializers.ModelSerializer):
    """Validate Professional payloads.
    Enforces identifier presence and uniqueness with clean API errors.
    """

    class Meta:
        model = Professional
        fields = "__all__"
        extra_kwargs = {
            "email": {"validators": []},  # we enforce uniqueness ourselves
            "phone": {"validators": []},
        }

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate identifiers and formats; enforce uniqueness for non-null values.
        Supports partial updates by considering existing instance values.
        """
        email: Optional[str] = data.get("email")
        phone: Optional[str] = data.get("phone")

        if self.partial and self.instance is not None:
            if not email:
                email = self.instance.email
            if not phone:
                phone = self.instance.phone

        if not email and not phone:
            raise serializers.ValidationError("Either email or phone is required.")

        if email and not re.match(EMAIL_REGEX, email):
            raise serializers.ValidationError(
                {"email": "Please enter a valid email address."}
            )

        if phone and not re.match(PHONE_REGEX, phone):
            raise serializers.ValidationError(
                {"phone": "Please enter a valid phone number."}
            )

        # Uniqueness checks for non-null values, excluding self on update
        instance_id: Optional[int] = getattr(self.instance, "id", None)

        if email:
            qs = Professional.objects.filter(email=email)
            if instance_id is not None:
                qs = qs.exclude(id=instance_id)
            if qs.exists():
                raise serializers.ValidationError(
                    {"email": "A professional with this email already exists."}
                )

        if phone:
            qs = Professional.objects.filter(phone=phone)
            if instance_id is not None:
                qs = qs.exclude(id=instance_id)
            if qs.exists():
                raise serializers.ValidationError(
                    {"phone": "A professional with this phone already exists."}
                )

        return data
