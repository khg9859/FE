import { useState } from "react";
import { useMatch } from "./MatchContext";

export default function MenteeRecruitTab({ userId, userName, darkMode }) {
  const {
    mentors,
    mentees,
    addMentee,
    deleteMentee,
    requestMatch,
  } = useMatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");
  const [interest, setInterest] = useState("");
  const [menteeContact, setMenteeContact] = useState("");

  const myMenteePost = mentees.find((m) => m.userId === userId);
  const myMentorPost = mentors.find((m) => m.userId === userId);

  // 글 등록
  const handleSubmit = () => {
    if (myMenteePost) return alert("이미 등록된 모집글이 있습니다.");
    if (!title || !desc) return alert("제목과 소개를 입력해주세요.");

    addMentee({
      id: Date.now(),
      userId,
      userName: userName || "익명",
      title,
      description: desc,
      goal: goal || "",
      interest: interest || "",
      mentee_contact: menteeContact || "",
    });
    setTitle("");
    setDesc("");
    setGoal("");
    setInterest("");
    setMenteeContact("");
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-xl transition-colors duration-300 max-w-6xl mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h3 className="text-2xl font-bold text-center mb-6">멘티</h3>

      {/* ✅ 모집글 등록 */}
      {!myMenteePost && (
        <div className="flex flex-col gap-3 mb-10">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`border p-2 rounded w-full ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <textarea
            placeholder="멘토에게 전달하고 싶은 내용이나 목표를 적어보세요"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className={`border p-2 rounded w-full h-32 resize-none ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <input
            type="text"
            placeholder="목표 (예: 체지방 감량 및 식단관리 배우기)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className={`border p-2 rounded w-full ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <input
            type="text"
            placeholder="관심사 (예: PT 입문 / 식단 루틴 설계)"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={`border p-2 rounded w-full ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <input
            type="text"
            placeholder="연락처 (예: mentee@hsu.ac.kr)"
            value={menteeContact}
            onChange={(e) => setMenteeContact(e.target.value)}
            className={`border p-2 rounded w-full ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <button
            onClick={handleSubmit}
            className="self-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            모집글 등록
          </button>
        </div>
      )}

      {/* ✅ 내 모집글 */}
      {myMenteePost && (
        <div className="mb-10 border rounded-lg p-4 shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h4 className="text-xl font-bold">내 모집글</h4>
            <button
              onClick={() => deleteMentee(myMenteePost.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 mt-2 md:mt-0"
            >
              삭제
            </button>
          </div>
          <p className="mt-2 font-semibold">{myMenteePost.title}</p>
          <p className="text-gray-400 mt-1">{myMenteePost.description}</p>
          <div className="mt-2 text-sm">
            {myMenteePost.goal && <p><strong>목표:</strong> {myMenteePost.goal}</p>}
            {myMenteePost.interest && <p><strong>관심사:</strong> {myMenteePost.interest}</p>}
            {myMenteePost.mentee_contact && <p><strong>연락처:</strong> {myMenteePost.mentee_contact}</p>}
          </div>
        </div>
      )}

      {/* ✅ 멘티 모집글 목록 (블로그 형식) */}
      <div>
        <h4 className="text-xl font-bold mb-3">멘티 모집글 목록</h4>
        {mentees.filter(m => m.userId !== userId).length === 0 && <p>등록된 멘티 모집글이 없습니다.</p>}

        <div className="space-y-4">
          {mentees.filter(mentee => mentee.userId !== userId).map((mentee) => (
            <div
              key={mentee.id}
              className={`rounded-lg shadow-md p-5 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h5 className="font-bold text-xl mb-2">{mentee.title}</h5>
              <p className="text-sm text-gray-400 mb-1">작성자: {mentee.userName}</p>
              <p className="text-gray-300 mb-3">{mentee.description}</p>

              {mentee.goal && (
                <p className="text-sm mb-1">
                  <span className="font-semibold">목표:</span> {mentee.goal}
                </p>
              )}
              {mentee.interest && (
                <p className="text-sm mb-1">
                  <span className="font-semibold">관심사:</span> {mentee.interest}
                </p>
              )}
              {mentee.mentee_contact && (
                <p className="text-sm mb-3">
                  <span className="font-semibold">연락처:</span> {mentee.mentee_contact}
                </p>
              )}

              {/* 신청하기 버튼 - 멘토 글을 쓴 사람만 표시 */}
              {myMentorPost && (
                <button
                  onClick={() => requestMatch(myMentorPost.id, mentee.id, userName)}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 mt-2"
                >
                  신청하기
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
