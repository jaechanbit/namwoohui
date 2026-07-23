export interface AttendanceSession {
  id: string;
  title: string;
  date: string;
  is_mutual_aid: boolean;
}

export interface AttendanceRecord {
  memberId: number;
  status: { [sessionId: string]: string };
}

export const initialSessions: AttendanceSession[] = [
  {
    "id": "2026-03-regular",
    "title": "3월 정기모임",
    "date": "2026-03-15",
    "is_mutual_aid": false
  },
  {
    "id": "2026-03-aid",
    "title": "3월 상조",
    "date": "2026-03-20",
    "is_mutual_aid": true
  },
  {
    "id": "2026-06-regular",
    "title": "6월 정기모임",
    "date": "2026-06-15",
    "is_mutual_aid": false
  },
  {
    "id": "2026-06-aid",
    "title": "6월 상조",
    "date": "2026-06-20",
    "is_mutual_aid": true
  }
];

export const initialRecords: AttendanceRecord[] = [
  {
    "memberId": 1,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 7,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 2,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 8,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 3,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 9,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 81,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 82,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 5,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 11,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 6,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 12,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 13,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "mutual_aid",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 19,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 14,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 20,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 15,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 21,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 22,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 16,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 17,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 23,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 18,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 24,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 83,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 25,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 26,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 84,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 27,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 85,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 86,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 28,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 87,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 29,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 88,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 30,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 31,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 37,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 89,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 32,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 33,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 39,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 34,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 40,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 35,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 41,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 36,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 42,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 43,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 49,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 44,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 50,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 45,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 51,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 46,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 52,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 47,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 53,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 48,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 54,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 55,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 61,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 56,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 62,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 57,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 63,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 58,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 64,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 59,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 65,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 60,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 66,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 67,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 74,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 68,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 75,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 69,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 76,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 70,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 77,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 78,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 72,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 79,
    "status": {
      "2026-03-regular": "present",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": "present"
    }
  },
  {
    "memberId": 73,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 80,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "present",
      "2026-06-regular": "present",
      "2026-06-aid": "present"
    }
  }
];
