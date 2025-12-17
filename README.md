# Hansung Gym Management System - Frontend

> 한성대학교 헬스장 통합 관리 시스템 프론트엔드
> React 18 + TailwindCSS 기반 SPA

---

## ✨ 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [배포](#배포)
- [API 연동](#api-연동)

---

## ✨ 프로젝트 개요

한성대학교 헬스장 회원을 위한 통합 관리 시스템의 프론트엔드입니다.
운동 루틴, 식단, 멘토링, 포인트 시스템 등을 직관적인 UI/UX로 제공합니다.

---

## ✨ 기술 스택

| 구분 | 기술 |
|------|------|
| **Framework** | React 19.2.0 |
| **Routing** | React Router DOM 7.9.5 |
| **Styling** | TailwindCSS 3.4.18 |
| **Animation** | Framer Motion 12.23.24 |
| **Charts** | Chart.js 4.5.1 |
| **State Management** | Context API |
| **Notifications** | React Hot Toast 2.6.0 |
| **HTTP Client** | Fetch API |

---

## ✨ 주요 기능

### ✨ **홈페이지**
- 배경 동영상
- 포인트 교환소 바로가기

### ✨ **마이페이지**
- ✨ 캘린더 기반 기록 표시
- ✨ 운동 기록 추가/조회
- ✨ 식단 기록 추가/조회
- ✨ 체중 변화 그래프 (Chart.js)
- ✨ 목표 설정 및 관리
- ✨ 운동 통계 (TOP 3, 부위별 분석)

### ✨ **교양수업 시간표**
- ✨ 현재 진행 중인 수업 표시
- ✨ 헬스장 혼잡도 실시간 표시
- ✨ 현재 이용 중인 회원 목록

### ✨ **멘토링 시스템**
- ✨ 멘토/멘티 모집 게시판
- ✨ 매칭 시스템
- ✨ 프로필 모달

### ✨ **헬스 가이드**
- ✨ 운동 루틴 추천
- ✨ 식단 추천

### ✨ **포인트/퀘스트**
- ✨ 퀘스트 시스템
- ✨ 자동 포인트 지급

### ✨ **포인트 교환소**
- ✨ 25개 보상 상품
- ✨ 카테고리별 필터링
- ✨ 교환 내역 관리

### ✨ **공지사항**
- ✨ 포인트 지급 조건 안내
- ✨ 헬스장 이용 안내

---

## ✨ 프로젝트 구조

```
FE/my-app/
├── public/
│   ├── index.html
│   ├── videos/
│   │   └── gym.mp4
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── mentoring/
│   │       ├── mentor.png
│   │       ├── mentee.png
│   │       └── defaultProfile.png
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── WeightChart.jsx
│   │   ├── DailyRecordCard.jsx
│   │   └── QuestList.jsx
│   ├── context/
│   │   ├── ThemeContext.jsx      # 다크모드 관리
│   │   └── PointContext.jsx       # 포인트 시스템
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MyPage.jsx            # 1900줄 (가장 큰 파일)
│   │   ├── Class.jsx
│   │   ├── Notice.jsx
│   │   ├── Incentive.jsx
│   │   ├── RewardShop.jsx
│   │   ├── Guide.jsx
│   │   ├── mentoring/
│   │   │   ├── Mentoring.jsx
│   │   │   ├── MentorRecruitTab.jsx
│   │   │   ├── MenteeRecruitTab.jsx
│   │   │   ├── MatchContext.jsx
│   │   │   └── MatchModal.jsx
│   │   └── guide/
│   │       ├── RoutineTab.jsx
│   │       └── DietTab.jsx
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ✨ 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/hsugym/FE.git
cd FE/my-app
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정 (선택사항)

백엔드 API 서버 URL 설정이 필요한 경우 `.env` 파일 생성:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. 개발 서버 실행

```bash
npm start
```

브라우저에서 자동으로 `http://localhost:3000` 열림

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

---

## ✨ 배포

### Vercel 배포 (추천)

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 저장소 연동
3. 프로젝트 import
4. 환경 변수 설정 (필요시)
5. Deploy 클릭
6. 자동 배포 완료!

**장점:**
- ✨ 무료
- ✨ GitHub 푸시 시 자동 배포
- ✨ HTTPS 자동 적용
- ✨ CDN 자동 설정

### Netlify 배포

1. [Netlify](https://netlify.com) 계정 생성
2. GitHub 저장소 연동
3. Build command: `npm run build`
4. Publish directory: `build`
5. Deploy

---

## ✨ API 연동

### 백엔드 연동 방법

현재 프론트엔드는 localStorage를 사용한 더미 데이터로 작동합니다.
백엔드 API와 연동하려면 다음 단계를 따르세요:

#### 1. API 클라이언트 설정

`src/utils/api.js` 파일 생성:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  // 회원
  getMembers: () => fetch(`${API_BASE_URL}/api/members`).then(res => res.json()),
  getMember: (id) => fetch(`${API_BASE_URL}/api/members/${id}`).then(res => res.json()),

  // 운동
  getExerciseList: () => fetch(`${API_BASE_URL}/api/exercises/list`).then(res => res.json()),
  getExerciseLogs: (memberId) => fetch(`${API_BASE_URL}/api/exercises/logs/${memberId}`).then(res => res.json()),
  addExerciseLog: (data) => fetch(`${API_BASE_URL}/api/exercises/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // 식단
  getFoodList: () => fetch(`${API_BASE_URL}/api/diet/list`).then(res => res.json()),
  getDietLogs: (memberId) => fetch(`${API_BASE_URL}/api/diet/logs/${memberId}`).then(res => res.json()),
  addDietLog: (data) => fetch(`${API_BASE_URL}/api/diet/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // 포인트
  getPoints: (memberId) => fetch(`${API_BASE_URL}/api/points/${memberId}`).then(res => res.json()),
  getAchievements: (memberId) => fetch(`${API_BASE_URL}/api/points/achievements/${memberId}`).then(res => res.json()),
};
```

#### 2. 컴포넌트에서 사용

```javascript
import { api } from '../utils/api';
import { useEffect, useState } from 'react';

function MyPage() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const memberId = 1; // 로그인한 회원 ID
    api.getExerciseLogs(memberId)
      .then(data => setExercises(data))
      .catch(error => console.error(error));
  }, []);

  // ...
}
```

#### 3. CORS 설정 확인

백엔드에서 CORS가 허용되어 있는지 확인하세요:

```javascript
// 백엔드 app.js
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 URL
  credentials: true
}));
```

---

## ✨ 디자인 특징

### 다크모드
- 모든 페이지에서 독립적인 다크모드 지원
- localStorage에 테마 설정 저장

### 애니메이션
- Framer Motion을 사용한 페이지 전환
- 컴포넌트 hover/tap 효과

### 반응형 디자인
- TailwindCSS 기반
- 모바일/태블릿/데스크톱 지원

---

## ✨ 데이터 저장

현재는 **localStorage**를 사용하여 데이터를 저장합니다:

- `attendances` - 출석 기록
- `exerciseLogs` - 운동 기록
- `dietLogs` - 식단 기록
- `healthRecords` - 건강 기록
- `goals` - 목표
- `userTotalPoints` - 포인���
- `achievementLogs` - 성취 로그

백엔드 API 연동 시 이 부분을 교체하면 됩니다.

---

## ✨ 포인트 시스템

자동 포인트 지급 조건:
- ✨ **운동 5회** → 100P
- ✨ **식단 3회** → 50P
- ✨ **출석 10회** → 200P
- ✨ **목표 2개** → 80P

---

## ✨ 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

## ✨ 관련 링크

- **Frontend**: [https://github.com/hsugym/FE](https://github.com/hsugym/FE)
- **Backend**: [https://github.com/hsugym/BE](https://github.com/hsugym/BE)

---

## ✨ 개발팀

**Hansung University Gym Team**

---

## ✨ 문의

프로젝트 관련 문의: gym@hansung.ac.kr
