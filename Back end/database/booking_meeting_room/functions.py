""" We define here some useful functions for the project. """

import datetime
from .models import Room, User, Meeting


def days_in_a_months(year: int, month: int) -> int:
    """
    Return the number of days of the month specified

    @param year:
    @param month:
    @return: int
    """
    return (datetime.date(year + month // 12, month % 12 + 1, 1) - datetime.date(year, month, 1)).days


def shift_date(year: int, month: int, day: int, hour: int, minute: int, duration: int
               ) -> tuple[int, int, int, int, int]:
    """
    Return the date corresponding to the date entered plus the duration (in minute) indicated
    @param year: int
    @param month: int
    @param day: int
    @param hour: int
    @param minute: int
    @param duration: int
    @return: tuple[int, int, int, int, int]
    """
    end_minute = minute + duration
    end_hour = hour
    end_day = day
    end_month = month
    end_year = year
    max_day = days_in_a_months(year, month)
    if end_minute >= 60:
        end_hour += end_minute // 60
        end_minute %= 60
    if end_hour >= 24:
        end_day += end_hour // 24
        end_hour %= 24
    while end_day >= max_day + 1:
        end_month += 1
        end_day -= max_day
        if end_month == 13:                 # days start to 1, not 0. That's why we can't use division
            end_year += 1                   # here.
            end_month = 1
        max_day = days_in_a_months(end_year, end_month)
    return end_year, end_month, end_day, end_hour, end_minute


def create_a_new_user(name: str, status: str) -> User:
    """
    @param name: str
    @param status: str
    @return: User
    """
    return User.objects.create(name=name, status=status)


def create_a_new_room(name: str, location: str, picture: str, videoconference: bool,
                      television_screen: bool, projector: bool, paperboard: bool, whiteboard: bool,
                      wall_whiteboard: bool, computer: bool, capacity: int = 1,
                      lab_validation: bool = False) -> Room:
    """
    @param name: str
    @param location: str
    @param picture: str
    @param videoconference: bool
    @param television_screen: bool
    @param projector: bool
    @param paperboard: bool
    @param whiteboard: bool
    @param wall_whiteboard: bool
    @param computer: bool
    @param capacity: int (optional)
    @param lab_validation: bool (optional)
    @return: Room
    """
    return Room.objects.create(capacity=capacity, name=name, location=location, picture=picture,
                               lab_validation=lab_validation, videoconference=videoconference,
                               television_screen=television_screen, projector=projector,
                               paperboard=paperboard, whiteboard=whiteboard,
                               wall_whiteboard=wall_whiteboard, computer=computer)


def create_a_new_meeting(room: Room, user: User, start_timestamps: datetime.datetime, title: str,
                         duration: int = 1, physically_present_person: int = None,
                         other_persons: str = None) -> Meeting:
    """
    @param room: Room
    @param user: User
    @param start_timestamps: datetime.datetime
    @param title: str
    @param duration: int
    @param physically_present_person: int (optional)
    @param other_persons: str (optional)
    @return: Meeting
    """
    return Meeting.objects.create(room=room, user=user, start_timestamps=start_timestamps, title=title,
                                  duration=duration, other_persons=other_persons,
                                  physically_present_person=physically_present_person,)


def modify_a_meeting(meeting: Meeting, room: Room = None, user: User = None, duration: int = None,
                     start_timestamps: datetime.datetime = None, finished: bool = None,
                     physically_present_person: int = None, other_persons: str = None, title: str = None,
                     remove_physically_present_person: bool = None, remove_other_persons: bool = None
                     ) -> None:
    """
    @param meeting: Meeting
    @param room: Room (optional)
    @param user: User (optional)
    @param start_timestamps: datetime.datetime (optional)
    @param finished: bool (optional)
    @param title: str (optional)
    @param duration: int (optional)
    @param physically_present_person: int (optional)
    @param other_persons: str (optional)
    @param remove_physically_present_person: bool (optional)
    @param remove_other_persons: bool (optional)
    """
    if remove_other_persons is None:
        remove_other_persons = False
    if remove_physically_present_person is None:
        remove_physically_present_person = False
    meeting.modify(room, user, start_timestamps, title, duration, physically_present_person,
                   other_persons, finished)
    meeting.remove_attribute(physically_present_person=remove_physically_present_person,
                             other_persons=remove_other_persons)
