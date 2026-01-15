from django.db import models


class Source(models.TextChoices):
    DIRECT = "direct", "Direct"
    PARTNER = "partner", "Partner"
    INTERNAL = "internal", "Internal"


class Professional(models.Model):
    full_name = models.CharField(max_length=255, db_index=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    company_name = models.CharField(max_length=255, db_index=True)
    job_title = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, unique=True, null=True, blank=True)
    source = models.CharField(max_length=20, choices=Source.choices, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "professionals"
        ordering = ["-created_at"]
        verbose_name = "Professional"
        verbose_name_plural = "Professionals"
        indexes = [
            models.Index(fields=["source", "created_at"], name="idx_source_created"),
            models.Index(fields=["company_name", "source"], name="idx_company_source"),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.email or self.phone})"
