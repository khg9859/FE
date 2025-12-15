import { useState } from "react";
import { useMatch } from "./MatchContext";
import MatchModal from "./MatchModal";

export default function ApplicationsTab({ userId, userName, darkMode }) {
  const {
    mentors,
    mentees,
    matches,
    acceptMatch,
    terminateMatch,
  } = useMatch();

  const [modal, setModal] = useState(null);

  // 내 글 찾기
  const myMentorPost = mentors.find((m) => m.userId === userId);
  const myMenteePost = mentees.find((m) => m.userId === userId);

  // 내 멘토 글에 신청한 사람들 (pending)
  // 멘토 글을 쓴 사람이 보는 신청 목록
  const mentorApplications = matches.filter(
    (m) => myMentorPost && m.mentorId === myMentorPost.id && m.status === "pending"
  );

  // 내 멘티 글에 신청한 사람들 (pending)
  // 멘티 글을 쓴 사람이 보는 신청 목록
  const menteeApplications = matches.filter(
    (m) => myMenteePost && m.menteeId === myMenteePost.id && m.status === "pending"
  );

  // 현재 활성화된 매칭 (멘토로서)
  const activeMentorMatch = matches.find(
    (m) => myMentorPost && m.mentorId === myMentorPost.id && m.status === "active"
  );

  // 현재 활성화된 매칭 (멘티로서)
  const activeMenteeMatch = matches.find(
    (m) => myMenteePost && m.menteeId === myMenteePost.id && m.status === "active"
  );

  // 모달 확인 동작
  const handleConfirm = (type, target) => {
    if (type === "accept") {
      acceptMatch(target.mentorId, target.menteeId);
    }
    if (type === "reject" || type === "terminate") {
      terminateMatch(target.mentorId, target.menteeId);
    }
    setModal(null);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-xl transition-colors duration-300 max-w-6xl mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h3 className="text-2xl font-bold text-center mb-6">신청 정보</h3>

      {/* 멘토로서 받은 신청 */}
      {myMentorPost && (
        <div className="mb-10">
          <h4 className="text-xl font-bold mb-4">나의 멘토 모집글에 신청한 멘티</h4>
          {mentorApplications.length === 0 ? (
            <p className="text-gray-400">아직 신청한 멘티가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {mentorApplications.map((application) => {
                const menteeData = mentees.find(m => m.id === application.menteeId);
                return (
                  <div
                    key={application.menteeId}
                    className={`border p-4 rounded-lg ${
                      darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-bold text-lg mb-1">{application.menteeName}</h5>
                        {menteeData && (
                          <div className="text-sm mt-2 space-y-1">
                            <p><strong>소개:</strong> {menteeData.description}</p>
                            {menteeData.goal && <p><strong>목표:</strong> {menteeData.goal}</p>}
                            {menteeData.interest && <p><strong>관심사:</strong> {menteeData.interest}</p>}
                            {menteeData.mentee_contact && <p><strong>연락처:</strong> {menteeData.mentee_contact}</p>}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setModal({ type: "accept", target: application })}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => setModal({ type: "reject", target: application })}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 멘티로서 받은 신청 */}
      {myMenteePost && (
        <div>
          <h4 className="text-xl font-bold mb-4">나의 멘티 모집글에 신청한 멘토</h4>
          {menteeApplications.length === 0 ? (
            <p className="text-gray-400">아직 신청한 멘토가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {menteeApplications.map((application) => {
                const mentorData = mentors.find(m => m.id === application.mentorId);
                return (
                  <div
                    key={application.mentorId}
                    className={`border p-4 rounded-lg ${
                      darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-bold text-lg mb-1">{application.mentorName}</h5>
                        {mentorData && (
                          <div className="text-sm mt-2 space-y-1">
                            <p><strong>소개:</strong> {mentorData.description}</p>
                            {mentorData.career && <p><strong>경력:</strong> {mentorData.career}</p>}
                            {mentorData.specialty && <p><strong>전문분야:</strong> {mentorData.specialty}</p>}
                            {mentorData.mentor_contact && <p><strong>연락처:</strong> {mentorData.mentor_contact}</p>}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setModal({ type: "accept", target: application })}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => setModal({ type: "reject", target: application })}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!myMentorPost && !myMenteePost && (
        <p className="text-center text-gray-400">멘토 또는 멘티 모집글을 작성하면 신청 정보를 확인할 수 있습니다.</p>
      )}

      {/* 매칭 파기 섹션 */}
      {(activeMentorMatch || activeMenteeMatch) && (
        <div className="mt-10 border-t pt-6">
          <h3 className="text-2xl font-bold text-center mb-6">현재 매칭</h3>

          {/* 멘토로서의 매칭 */}
          {activeMentorMatch && (
            <div className="mb-6">
              <h4 className="text-xl font-bold mb-4">멘티</h4>
              <div
                className={`border p-4 rounded-lg ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-bold text-lg mb-1">{activeMentorMatch.menteeName}</h5>
                    {(() => {
                      const menteeData = mentees.find(m => m.id === activeMentorMatch.menteeId);
                      return menteeData ? (
                        <div className="text-sm mt-2 space-y-1">
                          <p><strong>소개:</strong> {menteeData.description}</p>
                          {menteeData.goal && <p><strong>목표:</strong> {menteeData.goal}</p>}
                          {menteeData.interest && <p><strong>관심사:</strong> {menteeData.interest}</p>}
                          {menteeData.mentee_contact && <p><strong>연락처:</strong> {menteeData.mentee_contact}</p>}
                        </div>
                      ) : null;
                    })()}
                  </div>
                  <button
                    onClick={() => setModal({ type: "terminate", target: activeMentorMatch })}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
                  >
                    매칭 파기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 멘티로서의 매칭 */}
          {activeMenteeMatch && (
            <div>
              <h4 className="text-xl font-bold mb-4">멘토</h4>
              <div
                className={`border p-4 rounded-lg ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-bold text-lg mb-1">{activeMenteeMatch.mentorName}</h5>
                    {(() => {
                      const mentorData = mentors.find(m => m.id === activeMenteeMatch.mentorId);
                      return mentorData ? (
                        <div className="text-sm mt-2 space-y-1">
                          <p><strong>소개:</strong> {mentorData.description}</p>
                          {mentorData.career && <p><strong>경력:</strong> {mentorData.career}</p>}
                          {mentorData.specialty && <p><strong>전문분야:</strong> {mentorData.specialty}</p>}
                          {mentorData.mentor_contact && <p><strong>연락처:</strong> {mentorData.mentor_contact}</p>}
                        </div>
                      ) : null;
                    })()}
                  </div>
                  <button
                    onClick={() => setModal({ type: "terminate", target: activeMenteeMatch })}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
                  >
                    매칭 파기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 모달 */}
      {modal && (
        <MatchModal
          type={modal.type}
          targetName={modal.target.mentorName || modal.target.menteeName || "선택된 사용자"}
          darkMode={darkMode}
          onConfirm={() => handleConfirm(modal.type, modal.target)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
