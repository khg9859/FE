import { useState } from "react";
import { useMatch } from "./MatchContext";

export default function MentorRecruitTab({ userId, userName, darkMode }) {
  const {
    mentors,
    mentees,
    addMentor,
    deleteMentor,
    requestMatch,
  } = useMatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [career, setCareer] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [mentorContact, setMentorContact] = useState("");

  const myMentorPost = mentors.find((m) => m.userId === userId);
  const myMenteePost = mentees.find((m) => m.userId === userId);

  // 모집글 등록
  const handleSubmit = () => {
    if (myMentorPost) return alert("이미 등록된 모집글이 있습니다.");
    if (!title || !desc) return alert("제목과 소개를 입력해주세요.");

    addMentor({
      id: Date.now(),
      userId,
      userName: userName || "익명",
      title,
      description: desc,
      career: career || "",
      specialty: specialty || "",
      mentor_contact: mentorContact || "",
    });
    setTitle("");
    setDesc("");
    setCareer("");
    setSpecialty("");
    setMentorContact("");
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-xl transition-colors duration-300 max-w-6xl mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h3 className="text-2xl font-bold text-center mb-6">멘토</h3>

      {/* ✅ 모집글 등록 폼 */}
      {!myMentorPost && (
        <div className="flex flex-col gap-3 mb-10">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full text-black"
          />
          <textarea
            placeholder="멘토링 주제나 자기소개를 작성하세요"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded w-full text-black h-32 resize-none"
          />
          <input
            type="text"
            placeholder="경력 (예: 한성헬스장 전임 트레이너 5년차)"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="border p-2 rounded w-full text-black"
          />
          <input
            type="text"
            placeholder="전문 분야 (예: 근비대 및 체형 교정)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border p-2 rounded w-full text-black"
          />
          <input
            type="text"
            placeholder="연락처 (예: mentor@hsu.ac.kr)"
            value={mentorContact}
            onChange={(e) => setMentorContact(e.target.value)}
            className="border p-2 rounded w-full text-black"
          />
          <button
            onClick={handleSubmit}
            className="self-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            모집글 등록
          </button>
        </div>
      )}

      {/* ✅ 내 모집글 */}
      {myMentorPost && (
        <div className="mb-10 border rounded-lg p-4 shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h4 className="text-xl font-bold">내 모집글</h4>
            <button
              onClick={() => deleteMentor(myMentorPost.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 mt-2 md:mt-0"
            >
              삭제
            </button>
          </div>
          <p className="mt-2 font-semibold">{myMentorPost.title}</p>
          <p className="text-gray-400 mt-1">{myMentorPost.description}</p>
          <div className="mt-2 text-sm">
            {myMentorPost.career && <p><strong>경력:</strong> {myMentorPost.career}</p>}
            {myMentorPost.specialty && <p><strong>전문분야:</strong> {myMentorPost.specialty}</p>}
            {myMentorPost.mentor_contact && <p><strong>연락처:</strong> {myMentorPost.mentor_contact}</p>}
          </div>
        </div>
      )}

      {/* ✅ 멘토 모집글 목록 (블로그 형식) */}
      <div>
        <h4 className="text-xl font-bold mb-3">멘토 모집글 목록</h4>
        {mentors.filter(m => m.userId !== userId).length === 0 && <p>등록된 멘토 모집글이 없습니다.</p>}

        <div className="space-y-4">
          {mentors.filter(mentor => mentor.userId !== userId).map((mentor) => (
            <div
              key={mentor.id}
              className={`rounded-lg shadow-md p-5 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h5 className="font-bold text-xl mb-2">{mentor.title}</h5>
              <p className="text-sm text-gray-400 mb-1">작성자: {mentor.userName}</p>
              <p className="text-gray-300 mb-3">{mentor.description}</p>

              {mentor.career && (
                <p className="text-sm mb-1">
                  <span className="font-semibold">경력:</span> {mentor.career}
                </p>
              )}
              {mentor.specialty && (
                <p className="text-sm mb-1">
                  <span className="font-semibold">전문분야:</span> {mentor.specialty}
                </p>
              )}
              {mentor.mentor_contact && (
                <p className="text-sm mb-3">
                  <span className="font-semibold">연락처:</span> {mentor.mentor_contact}
                </p>
              )}

              {/* 신청하기 버튼 - 멘티 글을 쓴 사람만 표시 */}
              {myMenteePost && (
                <button
                  onClick={() => requestMatch(mentor.id, myMenteePost.id, userName)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2"
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
