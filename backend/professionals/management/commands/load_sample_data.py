from django.core.management.base import BaseCommand

from professionals.models import Professional


class Command(BaseCommand):
    help = "Load sample professional data for development and testing"

    def handle(self, *args, **options):
        sample_data = [
            {
                "full_name": "Alice Johnson",
                "email": "alice@techcorp.com",
                "phone": "5551001001",
                "company_name": "TechCorp",
                "job_title": "Software Engineer",
                "source": "direct",
            },
            {
                "full_name": "Bob Smith",
                "email": "bob@innovate.io",
                "phone": "5551001002",
                "company_name": "Innovate.io",
                "job_title": "Product Manager",
                "source": "partner",
            },
            {
                "full_name": "Carol Williams",
                "email": "carol@startup.co",
                "phone": "5551001003",
                "company_name": "StartupCo",
                "job_title": "CTO",
                "source": "internal",
            },
            {
                "full_name": "David Brown",
                "email": "david@enterprise.com",
                "phone": "5551001004",
                "company_name": "Enterprise Inc",
                "job_title": "Data Scientist",
                "source": "direct",
            },
            {
                "full_name": "Eva Martinez",
                "email": "eva@consulting.biz",
                "phone": "5551001005",
                "company_name": "Consulting Biz",
                "job_title": "Senior Consultant",
                "source": "partner",
            },
            {
                "full_name": "Frank Lee",
                "email": "frank@devshop.dev",
                "phone": "5551001006",
                "company_name": "DevShop",
                "job_title": "Full Stack Developer",
                "source": "direct",
            },
            {
                "full_name": "Grace Kim",
                "email": "grace@analytics.ai",
                "phone": "5551001007",
                "company_name": "Analytics AI",
                "job_title": "ML Engineer",
                "source": "internal",
            },
            {
                "full_name": "Henry Chen",
                "email": "henry@fintech.com",
                "phone": "5551001008",
                "company_name": "FinTech Corp",
                "job_title": "Backend Engineer",
                "source": "partner",
            },
            {
                "full_name": "Ivy Thompson",
                "phone": "5551001009",
                "company_name": "Design Studio",
                "job_title": "UX Designer",
                "source": "direct",
            },
            {
                "full_name": "Jack Wilson",
                "email": "jack@cloudservices.net",
                "company_name": "Cloud Services",
                "job_title": "DevOps Engineer",
                "source": "internal",
            },
        ]

        created_count = 0
        updated_count = 0

        for data in sample_data:
            email = data.get("email")
            phone = data.get("phone")

            instance = None
            if email:
                instance = Professional.objects.filter(email=email).first()
            elif phone:
                instance = Professional.objects.filter(phone=phone).first()

            if instance:
                for key, value in data.items():
                    setattr(instance, key, value)
                instance.save()
                updated_count += 1
                self.stdout.write(f"  Updated: {data['full_name']}")
            else:
                Professional.objects.create(**data)
                created_count += 1
                self.stdout.write(f"  Created: {data['full_name']}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSample data loaded: {created_count} created, {updated_count} updated"
            )
        )
