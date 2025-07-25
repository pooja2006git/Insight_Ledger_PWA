from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'amount', 'transaction_type', 'date', 'created_at']
    list_filter = ['transaction_type', 'date', 'created_at', 'user']
    search_fields = ['title', 'description', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'amount', 'transaction_type')
        }),
        ('Details', {
            'fields': ('description', 'date')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 