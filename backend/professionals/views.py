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
