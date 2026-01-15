from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BulkProfessionalView, ProfessionalViewSet

router = DefaultRouter()
router.register(r"", ProfessionalViewSet, basename="professional")

urlpatterns = [
    path("bulk/", BulkProfessionalView.as_view(), name="professional-bulk"),
    path("", include(router.urls)),
]
