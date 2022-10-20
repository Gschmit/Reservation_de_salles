""" File for link the app wherever we need """

from django.apps import AppConfig


class BookingMeetingRoomConfig(AppConfig):
    """
    Creation of the app
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'booking_meeting_room'
