# ✨ 한성대학교 헬스장 관리 시스템 - Frontend

React.js + TailwindCSS 기반 웹 애플리케이션

---

## ✨ 프로젝트 개요

한성대학교 헬스장 회원들을 위한 종합 관리 시스템의 프론트엔드입니다.
회원 정보 관리, 운동 기록, 식단 관리, 출석 체크, 포인트 시스템, 멘토링 매칭 등의 기능을 제공합니다.

---

## ✨ 기술 스택

| 구분 | 기술 |
|------|------|
| **Core** | React 19.2.0 |
| **Routing** | React Router DOM 7.9.5 |
| **Styling** | TailwindCSS 3.4.18 |
| **Animation** | Framer Motion 12.23.24 |
| **Charts** | Chart.js 4.5.1, React-ChartJS-2 5.3.1 |
| **Notifications** | React Hot Toast 2.6.0 |
| **State Management** | React Context API |
| **Build Tool** | Create React App |

---

## ✨ 주요 기능

### 회원 관리
- 로그인/로그아웃
- 프로필 조회 및 수정
- 건강 기록 관리

### 운동 기록
- 운동 로그 작성 및 조회
- 카테고리별 운동 목록
- 날짜별 운동 기록 필터링
- 운동 통계 시각화

### 식단 관리
- 식단 로그 작성 및 조회
- 카테고리별 음식 목록
- 칼로리 및 영양 정보
- 날짜별 식단 기록

### 출석 관리
- 입장/퇴장 체크
- 출석 기록 조회
- 헬스장 혼잡도 실시간 확인
- 현재 이용 중인 회원 수 표시

### 포인트 시스템
- 활동별 포인트 자동 적립
- 포인트 내역 조회
- 성취 로그 확인
- 보상 교환 기능

### 멘토링
- 멘토/멘티 모집글 작성
- 멘토링 신청 및 매칭
- 매칭 관리 및 종료

### 보상 상점
- 포인트로 상품 교환
- 교환 내역 확인
- 재고 실시간 업데이트

### 수업 시간표
- 교양수업 시간표 조회
- 요일별 수업 필터링
- 수업 상세 정보 확인

---

## ✨ 프로젝트 구조

```
FE/my-app/
├── public/
│   ├── videos/              # 배경 비디오 파일
│   └── index.html
├── src/
│   ├── assets/              # 이미지, 아이콘
│   │   └── mentoring/       # 멘토링 관련 이미지
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ChartComponent.jsx
│   │   ├── ExerciseChart.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── context/             # Context API 상태 관리
│   │   └── AuthContext.jsx
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── mentoring/       # 멘토링 페이지
│   │   │   ├── Mentoring.jsx
│   │   │   ├── MatchContext.jsx
│   │   │   ├── ApplicationsTab.jsx
│   │   │   ├── MatchModal.jsx
│   │   │   ├── MentorRecruitTab.jsx
│   │   │   └── MenteeRecruitTab.jsx
│   │   ├── Attendance.jsx   # 출석 관리
│   │   ├── Classes.jsx      # 수업 시간표
│   │   ├── Dashboard.jsx    # 대시보드
│   │   ├── Diet.jsx         # 식단 관리
│   │   ├── Exercise.jsx     # 운동 기록
│   │   ├── Home.jsx         # 홈
│   │   ├── Login.jsx        # 로그인
│   │   ├── MyPage.jsx       # 마이페이지
│   │   ├── Points.jsx       # 포인트
│   │   └── Rewards.jsx      # 보상 상점
│   ├── App.jsx              # 루트 컴포넌트
│   ├── App.css
│   ├── index.jsx            # 진입점
│   └── index.css
├── .env                     # 환경 변수
├── .gitignore
├── package.json
├── tailwind.config.js       # TailwindCSS 설정
├── postcss.config.js
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

### 3. 환경 변수 설정

`.env` 파일 생성:

```env
REACT_APP_API_URL=http://localhost:5001
```

### 4. 개발 서버 실행

```bash
npm start
```

브라우저에서 자동으로 [http://localhost:3000](http://localhost:3000) 열림

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 디렉토리에 생성됩니다.

---

## ✨ 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `REACT_APP_API_URL` | 백엔드 API URL | http://localhost:5001 |
| `proxy` (package.json) | 개발 서버 프록시 | http://localhost:5001 |

---

## ✨ 페이지 구성

### 공개 페이지
- `/` - 메인 홈페이지 (배경 비디오)
- `/login` - 로그인 페이지

### 인증 필요 페이지
- `/dashboard` - 대시보드 (통계 및 요약)
- `/exercise` - 운동 기록 관리
- `/diet` - 식단 기록 관리
- `/attendance` - 출석 관리
- `/points` - 포인트 및 성취 내역
- `/rewards` - 보상 상점
- `/mentoring` - 멘토링 매칭
- `/classes` - 교양수업 시간표
- `/mypage` - 마이페이지 (프로필 관리)

---

## ✨ 주요 컴포넌트

### AuthContext
- 사용자 인증 상태 관리
- 로그인/로그아웃 처리
- 전역 사용자 정보 제공

### MatchContext
- 멘토링 매칭 상태 관리
- 멘토/멘티 모집글 관리
- 매칭 요청 및 수락/거절 처리

### Navbar
- 상단 네비게이션 바
- 로그인 상태에 따른 메뉴 변경
- 사용자 정보 표시

### Sidebar
- 좌측 사이드바 메뉴
- 페이지 네비게이션
- 반응형 토글 기능

### ChartComponent
- 운동 및 식단 통계 시각화
- Chart.js 기반 그래프
- 라인, 바, 도넛 차트 지원

---

## ✨ 스타일링

### TailwindCSS
- Utility-first CSS 프레임워크
- 반응형 디자인
- 다크모드 지원 (일부 페이지)
- 커스텀 색상 및 테마

### Framer Motion
- 페이지 전환 애니메이션
- 모달 애니메이션
- 카드 호버 효과
- 부드러운 UI/UX

---

## ✨ 배포

### Vercel 배포 (추천)

```bash
npm install -g vercel
vercel
```

### Netlify 배포

1. GitHub 저장소 연동
2. 빌드 설정
   - Build command: `npm run build`
   - Publish directory: `build`
3. 환경 변수 설정
4. 배포

---

## ✨ 개발 가이드

### API 호출 예시

```jsx
const response = await fetch("http://localhost:5001/api/members");
const data = await response.json();
```

### Context 사용 예시

```jsx
import { useAuth } from "./context/AuthContext";

function MyComponent() {
  const { user, login, logout } = useAuth();
  return <div>{user?.name}</div>;
}
```

---

## ✨ 테스트

```bash
npm test
```

---

## ✨ 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
