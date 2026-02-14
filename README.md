# 곰돌이 수학 (gomMath)

아이들이 4연산을 재미있게 연습할 수 있는 웹 학습 앱입니다.  
곰돌이 선생님 캐릭터와 스티커 보상으로 학습 몰입을 높이도록 설계했습니다.

## 주요 기능

- 4연산 학습: 더하기, 빼기, 곱하기, 나누기, 랜덤 모드
- 난이도 3단계: 쉬움 / 보통 / 도전
- 10문제 라운드 진행 + 즉시 정답/오답 피드백
- 힌트 제공
- 오늘 학습 통계:
  - 오늘 맞힌 문제 수
  - 현재 연속 정답
  - 최고 연속 기록
  - 오늘 정답률
- 정답 수 기반 스티커 보상 UI
- 로컬 저장(localStorage)으로 오늘 기록과 마지막 학습 설정 유지

## 기술 스택

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL (선택, `DATABASE_URL` 설정 시 활성화)

## 실행 방법

```bash
npm install
npm start
```

기본 실행 주소:

- [http://localhost:3000](http://localhost:3000)

## 프로젝트 구조

```text
.
├── index.html      # 메인 화면 구조
├── styles.css      # 곰돌이 테마 UI 스타일
├── app.js          # 문제 생성/채점/진행도/통계 로직
├── server.js       # 정적 파일 서빙 + API
└── data/           # 기존 데이터 폴더(필요 시 확장)
```

## API (선택 기능)

`DATABASE_URL`이 설정되어 있으면 아래 API가 동작합니다.

- `GET /api/health`
- `GET /api/readings?userId=...&limit=...`
- `POST /api/readings`

현재 수학 MVP는 프론트 로컬 저장 중심으로 동작하며, DB는 향후 학습 기록 확장용으로 활용할 수 있습니다.

## 로드맵

- 받아올림/받아내림 문제 유형 추가
- 나머지 나눗셈 모드 추가
- 학부모용 진도 리포트 화면 추가
- 학년/연령별 커리큘럼 모드 추가
