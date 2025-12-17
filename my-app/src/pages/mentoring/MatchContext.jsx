import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getApiUrl } from "../../config/api";

const MatchContext = createContext();
export const useMatch = () => useContext(MatchContext);

const API_URL = getApiUrl("/api/mentoring");

export function MatchProvider({ children }) {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [matches, setMatches] = useState([]);

  // ✅ 서버에서 데이터 로드
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [mentorsRes, menteesRes, applicationsRes] = await Promise.all([
        fetch(`${API_URL}/mentors/posts`),
        fetch(`${API_URL}/mentees/posts`),
        fetch(`${API_URL}/applications`)
      ]);

      const mentorsData = await mentorsRes.json();
      const menteesData = await menteesRes.json();
      const applicationsData = await applicationsRes.json();

      setMentors(mentorsData.map(p => ({
        id: Number(p.post_id),
        userId: Number(p.member_id),
        userName: p.user_name,
        title: p.title,
        description: p.description,
        career: p.career,
        specialty: p.specialty,
        mentor_contact: p.mentor_contact
      })));

      setMentees(menteesData.map(p => ({
        id: Number(p.post_id),
        userId: Number(p.member_id),
        userName: p.user_name,
        title: p.title,
        description: p.description,
        goal: p.goal,
        interest: p.interest,
        mentee_contact: p.mentee_contact
      })));

      // 서버에서 받은 신청/매칭 데이터 변환
      setMatches(applicationsData.map(app => ({
        mentoringId: app.mentoring_id,
        mentorUserId: Number(app.mentor_id),
        menteeUserId: Number(app.mentee_id),
        mentorId: Number(app.mentor_id), // post_id 대신 member_id 사용
        menteeId: Number(app.mentee_id), // post_id 대신 member_id 사용
        mentorName: app.mentor_name,
        menteeName: app.mentee_name,
        status: app.status === "PENDING" ? "pending" : app.status === "ACTIVE" ? "active" : "ended"
      })));
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  // ✅ 글 등록
  const addMentor = async (mentor) => {
    try {
      const response = await fetch(`${API_URL}/mentors/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: mentor.userId,
          title: mentor.title,
          description: mentor.description,
          career: mentor.career,
          specialty: mentor.specialty,
          mentor_contact: mentor.mentor_contact
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "등록 실패");
        return;
      }

      toast.success("멘토 모집글이 등록되었습니다!");
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("멘토 등록 실패:", error);
      toast.error("등록 중 오류가 발생했습니다.");
    }
  };

  const addMentee = async (mentee) => {
    try {
      const response = await fetch(`${API_URL}/mentees/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: mentee.userId,
          title: mentee.title,
          description: mentee.description,
          goal: mentee.goal,
          interest: mentee.interest,
          mentee_contact: mentee.mentee_contact
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "등록 실패");
        return;
      }

      toast.success("멘티 모집글이 등록되었습니다!");
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("멘티 등록 실패:", error);
      toast.error("등록 중 오류가 발생했습니다.");
    }
  };

  // ✅ 글 삭제
  const deleteMentor = async (id) => {
    try {
      await fetch(`${API_URL}/mentors/posts/${id}`, {
        method: "DELETE"
      });

      toast.success("멘토 모집글이 삭제되었습니다.");
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("멘토 삭제 실패:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  const deleteMentee = async (id) => {
    try {
      await fetch(`${API_URL}/mentees/posts/${id}`, {
        method: "DELETE"
      });

      toast.success("멘티 모집글이 삭제되었습니다.");
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("멘티 삭제 실패:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 매칭 요청 (멘티가 멘토에게 신청)
  const requestMatch = async (mentorUserId, menteeUserId, applicantName) => {
    // userId로 멘토/멘티 찾기
    const mentor = mentors.find((m) => m.userId === mentorUserId);
    const mentee = mentees.find((m) => m.userId === menteeUserId);

    console.log("🔍 requestMatch 호출:", { mentorUserId, menteeUserId, mentor, mentee });

    if (!mentor) {
      toast.error("멘토 정보를 찾을 수 없습니다.");
      return;
    }

    if (!mentee) {
      toast.error("멘티 모집글을 먼저 작성해주세요.");
      return;
    }

    // 이미 매칭 존재?
    if (matches.some((m) => m.mentorUserId === mentorUserId && m.menteeUserId === menteeUserId)) {
      toast.error("이미 신청했거나 매칭된 상태입니다.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentor_id: mentorUserId,
          mentee_id: menteeUserId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "신청 실패");
        return;
      }

      toast.success("멘토에게 신청이 완료되었습니다!");
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("신청 실패:", error);
      toast.error("신청 중 오류가 발생했습니다.");
    }
  };

  // ✅ 매칭 수락 (멘토가 멘티의 신청을 수락)
  const acceptMatch = async (mentorUserId, menteeUserId) => {
    try {
      const match = matches.find(m => m.mentorUserId === mentorUserId && m.menteeUserId === menteeUserId);
      if (!match) {
        toast.error("신청을 찾을 수 없습니다.");
        return;
      }

      const response = await fetch(`${API_URL}/accept/${match.mentoringId}`, {
        method: "PUT"
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "수락 실패");
        return;
      }

      toast.success("🎉 매칭이 완료되었습니다!");
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("수락 실패:", error);
      toast.error("수락 중 오류가 발생했습니다.");
    }
  };

  // ✅ 매칭 파기 또는 거절
  const terminateMatch = async (mentorUserId, menteeUserId) => {
    try {
      const match = matches.find(m => m.mentorUserId === mentorUserId && m.menteeUserId === menteeUserId);
      if (!match) {
        toast.error("매칭을 찾을 수 없습니다.");
        return;
      }

      const response = await fetch(`${API_URL}/reject/${match.mentoringId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "처리 실패");
        return;
      }

      toast("매칭이 종료되었습니다.", {
        icon: "⚠️",
        style: { background: "#555", color: "#fff" },
      });
      await fetchAllData(); // 데이터 새로고침
    } catch (error) {
      console.error("처리 실패:", error);
      toast.error("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <MatchContext.Provider
      value={{
        mentors,
        mentees,
        matches,
        addMentor,
        addMentee,
        deleteMentor,
        deleteMentee,
        requestMatch,
        acceptMatch,
        terminateMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}