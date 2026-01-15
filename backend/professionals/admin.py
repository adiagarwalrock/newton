from django.contrib import admin

from .models import Professional


@admin.register(Professional)
class ProfessionalAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "company_name",
        "job_title",
        "phone",
        "source",
        "created_at",
    )
    list_filter = ("source", "created_at")
    search_fields = ("full_name", "email", "company_name", "job_title", "phone")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
    list_per_page = 25

    fieldsets = (
        (
            "Personal Information",
            {
                "fields": ("full_name",),
                "description": "Basic identity information for the professional.",
            },
        ),
        (
            "Contact Details",
            {
                "fields": ("email", "phone"),
                "description": "At least one contact method is required.",
            },
        ),
        (
            "Professional Details",
            {
                "fields": ("company_name", "job_title"),
            },
        ),
        (
            "Source & Metadata",
            {
                "fields": ("source", "created_at"),
                "classes": ("collapse",),
            },
        ),
    )
