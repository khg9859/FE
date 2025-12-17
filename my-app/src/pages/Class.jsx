import { useState, useEffect } from "react";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});
  const [currentUsers, setCurrentUsers] = useState([]);
  const [crowdInfo, setCrowdInfo] = useState({ current: 0, available: 30 });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // 다크모드 유지
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    loadAllData();
    loadGymStatus();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      loadGymStatus();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      const dummyClasses = [
        { class_id: 1, class_name: "체육실기 A", instructor_name: "김교수", capacity: 30 },
        { class_id: 2, class_name: "체육실기 B", instructor_name: "이교수", capacity: 25 },
        { class_id: 3, class_name: "건강과 운동", instructor_name: "박교수", capacity: 35 },
        { class_id: 4, class_name: "생활체육", instructor_name: "최교수", capacity: 28 },
        { class_id: 5, class_name: "스포츠마사지", instructor_name: "정교수", capacity: 20 },
        { class_id: 6, class_name: "웰니스와 건강", instructor_name: "강교수", capacity: 32 },
        { class_id: 7, class_name: "체력관리", instructor_name: "윤교수", capacity: 26 },
        { class_id: 8, class_name: "운동생리학", instructor_name: "한교수", capacity: 30 },
        { class_id: 9, class_name: "스포츠영양학", instructor_name: "서교수", capacity: 24 },
        { class_id: 10, class_name: "퍼스널트레이닝", instructor_name: "오교수", capacity: 22 },
        { class_id: 11, class_name: "필라테스", instructor_name: "신교수", capacity: 18 },
        { class_id: 12, class_name: "요가와 명상", instructor_name: "임교수", capacity: 20 },
        { class_id: 13, class_name: "크로스핏", instructor_name: "배교수", capacity: 25 },
      ];

      const dummySchedules = {
        1: [
          { schedule_id: 1, class_id: 1, day_of_week: "월", start_time: "09:00:00", end_time: "10:30:00" },
          { schedule_id: 2, class_id: 1, day_of_week: "수", start_time: "09:00:00", end_time: "10:30:00" },
        ],
        2: [
          { schedule_id: 3, class_id: 2, day_of_week: "화", start_time: "13:00:00", end_time: "14:30:00" },
          { schedule_id: 4, class_id: 2, day_of_week: "목", start_time: "13:00:00", end_time: "14:30:00" },
        ],
        3: [
          { schedule_id: 5, class_id: 3, day_of_week: "금", start_time: "15:00:00", end_time: "16:30:00" },
        ],
        4: [
          { schedule_id: 6, class_id: 4, day_of_week: "월", start_time: "14:00:00", end_time: "15:30:00" },
          { schedule_id: 7, class_id: 4, day_of_week: "목", start_time: "14:00:00", end_time: "15:30:00" },
        ],
        5: [
          { schedule_id: 8, class_id: 5, day_of_week: "화", start_time: "10:00:00", end_time: "11:30:00" },
          { schedule_id: 9, class_id: 5, day_of_week: "금", start_time: "10:00:00", end_time: "11:30:00" },
        ],
        6: [
          { schedule_id: 10, class_id: 6, day_of_week: "수", start_time: "11:00:00", end_time: "12:30:00" },
        ],
        7: [
          { schedule_id: 11, class_id: 7, day_of_week: "월", start_time: "16:00:00", end_time: "17:30:00" },
          { schedule_id: 12, class_id: 7, day_of_week: "수", start_time: "16:00:00", end_time: "17:30:00" },
        ],
        8: [
          { schedule_id: 13, class_id: 8, day_of_week: "화", start_time: "15:00:00", end_time: "16:30:00" },
        ],
        9: [
          { schedule_id: 14, class_id: 9, day_of_week: "목", start_time: "11:00:00", end_time: "12:30:00" },
        ],
        10: [
          { schedule_id: 15, class_id: 10, day_of_week: "금", start_time: "13:00:00", end_time: "14:30:00" },
        ],
        11: [
          { schedule_id: 16, class_id: 11, day_of_week: "화", start_time: "09:00:00", end_time: "10:30:00" },
          { schedule_id: 17, class_id: 11, day_of_week: "목", start_time: "09:00:00", end_time: "10:30:00" },
        ],
        12: [
          { schedule_id: 18, class_id: 12, day_of_week: "월", start_time: "11:00:00", end_time: "12:30:00" },
          { schedule_id: 19, class_id: 12, day_of_week: "수", start_time: "11:00:00", end_time: "12:30:00" },
        ],
        13: [
          { schedule_id: 20, class_id: 13, day_of_week: "수", start_time: "14:00:00", end_time: "15:30:00" },
          { schedule_id: 21, class_id: 13, day_of_week: "금", start_time: "14:00:00", end_time: "15:30:00" },
        ],
      };

      setClasses(dummyClasses);
      setClassSchedules(dummySchedules);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGymStatus = async () => {
    try {
      const savedAttendances = localStorage.getItem("attendances");
      let attendances = [];

      if (savedAttendances) {
        attendances = JSON.parse(savedAttendances);
      } else {
        attendances = [
          { member_id: 1, name: "김철수", student_no: "20210001", entered_at: "2025-01-23T09:30:00", left_at: null },
          { member_id: 2, name: "이영희", student_no: "20210002", entered_at: "2025-01-23T10:15:00", left_at: null },
          { member_id: 3, name: "박민수", student_no: "20210003", entered_at: "2025-01-23T10:45:00", left_at: null },
          { member_id: 4, name: "최지은", student_no: "20210004", entered_at: "2025-01-23T11:00:00", left_at: null },
          { member_id: 5, name: "정우성", student_no: "20210005", entered_at: "2025-01-23T11:20:00", left_at: null },
          { member_id: 6, name: "강민지", student_no: "20210006", entered_at: "2025-01-23T11:35:00", left_at: null },
          { member_id: 7, name: "윤서준", student_no: "20210007", entered_at: "2025-01-23T12:00:00", left_at: null },
          { member_id: 8, name: "한지민", student_no: "20210008", entered_at: "2025-01-23T12:15:00", left_at: null },
        ];
        localStorage.setItem("attendances", JSON.stringify(attendances));
      }

      const currentUsers = attendances.filter((a) => !a.left_at);

      setCurrentUsers(currentUsers);
      setCrowdInfo({
        current: currentUsers.length,
        available: 30 - currentUsers.length,
      });
    } catch (error) {
      console.error("헬스장 현황 로드 실패:", error);
    }
  };

  const getCurrentClass = () => {
    const now = currentTime;
    const currentDay = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;

    for (const cls of classes) {
      const schedules = classSchedules[cls.class_id] || [];
      for (const schedule of schedules) {
        if (schedule.day_of_week === currentDay) {
          if (currentTimeStr >= schedule.start_time && currentTimeStr < schedule.end_time) {
            return { class: cls, schedule };
          }
        }
      }
    }
    return null;
  };

  const getNextClass = () => {
    const now = currentTime;
    const currentDay = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;

    let nextClass = null;
    let minTimeDiff = Infinity;

    for (const cls of classes) {
      const schedules = classSchedules[cls.class_id] || [];
      for (const schedule of schedules) {
        if (schedule.day_of_week === currentDay && schedule.start_time > currentTimeStr) {
          const timeDiff = timeStringToMinutes(schedule.start_time) - timeStringToMinutes(currentTimeStr);
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            nextClass = { class: cls, schedule };
          }
        }
      }
    }
    return nextClass;
  };

  const timeStringToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getClassStatus = (classId) => {
    const now = currentTime;
    const currentDay = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;

    const schedules = classSchedules[classId] || [];

    for (const schedule of schedules) {
      if (schedule.day_of_week === currentDay) {
        if (currentTimeStr >= schedule.start_time && currentTimeStr < schedule.end_time) {
          return "진행 중";
        } else if (currentTimeStr < schedule.start_time) {
          return "예정";
        }
      }
    }
    return "종료";
  };

  const getGymImpactMessage = (capacity) => {
    if (capacity >= 30) {
      return "수업 시간 동안 헬스장 이용이 크게 제한됩니다";
    } else if (capacity >= 20) {
      return "수업 시간 동안 헬스장 이용이 일부 제한됩니다";
    } else {
      return "수업 시간 동안 헬스장 이용이 소폭 제한됩니다";
    }
  };

  const dayOrder = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7 };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();
  const isGymAvailable = !currentClass;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl font-semibold">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">교양수업 시간표</h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            교양 수업 시간에는 헬스장 이용이 제한됩니다
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            현재 상태
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              darkMode
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {darkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
          </button>
        </div>
      </div>

      {/* 실시간 헬스장 이용 현황 */}
      <div className={`rounded-lg shadow mb-8 transition ${
        darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">실시간 헬스장 이용 현황</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                현재 헬스장을 이용 중인 회원을 실시간으로 확인하세요
              </p>
            </div>

            <div className={`flex items-center gap-6 px-6 py-3 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <div className="text-center">
                <div className={`text-xs font-semibold mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  현재 인원
                </div>
                <div className="text-2xl font-bold text-blue-600">{crowdInfo.current}명</div>
              </div>
              <div className={`w-px h-12 ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
              <div className="text-center">
                <div className={`text-xs font-semibold mb-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  남은 자리
                </div>
                <div className="text-2xl font-bold text-green-600">{crowdInfo.available}명</div>
              </div>
            </div>
          </div>

          {/* 혼잡도 바 */}
          <div className="mb-6">
            <div className={`h-4 rounded-full overflow-hidden ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}>
              <div
                style={{ width: `${(crowdInfo.current / 30) * 100}%` }}
                className={`h-full transition-all duration-300 ${
                  crowdInfo.current < 15
                    ? "bg-green-500"
                    : crowdInfo.current < 25
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </div>
            <div className="flex justify-between mt-2 px-2">
              <span className="text-xs font-semibold text-green-600">여유</span>
              <span className="text-xs font-semibold text-yellow-600">보통</span>
              <span className="text-xs font-semibold text-red-600">혼잡</span>
            </div>
          </div>

          {/* 현재 이용 중인 회원 목록 */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              현재 이용 중인 회원 ({currentUsers.length}명)
            </h3>

            {currentUsers.length === 0 ? (
              <div className={`text-center py-12 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}>
                <div className="text-xl font-semibold">현재 이용 중인 회원이 없습니다</div>
                <div className="text-sm mt-1">헬스장이 비어있습니다</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentUsers.map((user) => (
                  <div
                    key={user.member_id}
                    className={`rounded-lg p-4 border transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-bold text-base mb-1">{user.name}</div>
                    <div className={`text-sm mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {user.student_no}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      입장: {new Date(user.entered_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className={`mt-2 px-2 py-1 rounded text-xs font-semibold text-center ${
                      darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
                    }`}>
                      이용 중: {[45, 32, 58, 23, 67, 41, 55, 38][user.member_id - 1] || 30}분
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 수업 시간표 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">교양수업 목록</h2>
        <div className="space-y-4">
          {classes.map((cls) => {
            const schedules = classSchedules[cls.class_id] || [];
            const status = getClassStatus(cls.class_id);

            return (
              <div
                key={cls.class_id}
                className={`rounded-lg shadow p-6 transition ${
                  darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
                }`}
              >
                {/* 수업명 + 상태 */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{cls.class_name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "진행 중"
                        ? "bg-red-100 text-red-700"
                        : status === "예정"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* 수업 시간 */}
                {schedules.length > 0 && (
                  <div className="mb-3">
                    <div className={`text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      수업 시간
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {schedules
                        .sort((a, b) => dayOrder[a.day_of_week] - dayOrder[b.day_of_week])
                        .map((schedule, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              darkMode
                                ? "bg-blue-900 text-blue-200"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {schedule.day_of_week}요일 {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 제한 인원 / 담당교수 */}
                <div className={`space-y-1 text-sm mb-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div>
                    <span className="font-semibold">헬스장 제한 인원:</span> {cls.capacity}명
                  </div>
                  <div>
                    <span className="font-semibold">담당교수:</span> {cls.instructor_name || "미정"}
                  </div>
                </div>

                {/* 헬스장 이용 영향 요약 */}
                <div className={`pt-3 border-t text-sm ${
                  darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"
                }`}>
                  {getGymImpactMessage(cls.capacity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 현재 상태 모달 */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-2xl p-6 max-w-md w-full ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">현재 상태</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className={`text-2xl ${
                  darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ×
              </button>
            </div>

            {/* 현재 시간 */}
            <div className={`mb-4 pb-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className={`text-sm mb-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                현재 시간
              </div>
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {currentTime.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
              </div>
            </div>

            {/* 이용 가능 여부 */}
            <div
              className={`rounded-lg p-4 mb-4 text-center ${
                isGymAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div className="text-xl font-bold mb-1">
                {isGymAvailable ? "이용 가능" : "이용 제한"}
              </div>
              <div className="text-sm">
                {isGymAvailable
                  ? "지금 헬스장을 자유롭게 이용할 수 있습니다"
                  : "교양 수업으로 인해 헬스장 이용이 제한됩니다"}
              </div>
            </div>

            {/* 현재 진행 중인 수업 */}
            {currentClass && (
              <div className={`rounded-lg p-4 mb-4 ${
                darkMode ? "bg-red-900 bg-opacity-30" : "bg-red-50"
              }`}>
                <div className={`text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  현재 진행 중인 수업
                </div>
                <div className="font-bold text-base mb-1">{currentClass.class.class_name}</div>
                <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {currentClass.schedule.day_of_week}요일 {currentClass.schedule.start_time?.substring(0, 5)} - {currentClass.schedule.end_time?.substring(0, 5)}
                </div>
                <div className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  헬스장 제한 인원: {currentClass.class.capacity}명
                </div>
              </div>
            )}

            {/* 다음 수업 */}
            {nextClass && !currentClass && (
              <div className={`rounded-lg p-4 ${
                darkMode ? "bg-blue-900 bg-opacity-30" : "bg-blue-50"
              }`}>
                <div className={`text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  다음 수업
                </div>
                <div className="font-bold text-base mb-1">{nextClass.class.class_name}</div>
                <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {nextClass.schedule.start_time?.substring(0, 5)} 시작
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
