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
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 7,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 2,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 8,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 3,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 9,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 81,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 82,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 5,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 11,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 6,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 12,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 13,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "상주",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 19,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 14,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 20,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 15,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 21,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 22,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 16,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 17,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 23,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 18,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 24,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 83,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 25,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 26,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 84,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 27,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 85,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 86,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 28,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 87,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 29,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 88,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 30,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 31,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 37,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 89,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 32,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 33,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 39,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 34,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 40,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 35,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 41,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 36,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 42,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 43,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 49,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 44,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 50,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 45,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 51,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 46,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 52,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 47,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 53,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 48,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 54,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 55,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 61,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 56,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 62,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 57,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 63,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 58,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 64,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 59,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 65,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 60,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 66,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 67,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 74,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 68,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 75,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 69,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 76,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 70,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 77,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 78,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 72,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 79,
    "status": {
      "2026-03-regular": "○",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": "○"
    }
  },
  {
    "memberId": 73,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "",
      "2026-06-aid": ""
    }
  },
  {
    "memberId": 80,
    "status": {
      "2026-03-regular": "",
      "2026-03-aid": "○",
      "2026-06-regular": "○",
      "2026-06-aid": "○"
    }
  }
];
