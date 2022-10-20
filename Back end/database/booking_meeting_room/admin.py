"""
superUsername : admin
password : azerty
"""

from django.contrib import admin
from .models import Room, User, Meeting

admin.site.register(Room)
admin.site.register(User)
admin.site.register(Meeting)
