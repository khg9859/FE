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
    // localStorage에서 matches 먼저 불러오기
    const savedMatches = localStorage.getItem("matches");
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [mentorsRes, menteesRes] = await Promise.all([
        fetch(`${API_URL}/mentors/posts`),
        fetch(`${API_URL}/mentees/posts`)
      ]);

      const mentorsData = await mentorsRes.json();
      const menteesData = await menteesRes.json();

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

  // ✅ 매칭 요청
  const requestMatch = (mentorId, menteeId, menteeName) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    const mentee = mentees.find((m) => m.id === menteeId);

    console.log("🔍 requestMatch 호출:", { mentorId, menteeId, mentor, mentee });

    if (!mentor || !mentee) {
      toast.error("멘토 또는 멘티 정보를 찾을 수 없습니다.");
      return;
    }

    // 이미 매칭 존재?
    if (matches.some((m) => m.mentorId === mentorId && m.menteeId === menteeId)) {
      toast.error("이미 신청했거나 매칭된 상태입니다.");
      return;
    }

    const newMatch = {
      mentorId,
      menteeId,
      mentorName: mentor.userName || "익명 멘토",
      menteeName: mentee.userName || "익명 멘티",
      status: "pending", // 대기중 상태로 변경
    };

    console.log("✅ 생성된 매칭:", newMatch);

    setMatches((prev) => {
      const updated = [...prev, newMatch];
      console.log("📦 전체 매칭 목록:", updated);
      localStorage.setItem("matches", JSON.stringify(updated)); // 즉시 저장
      return updated;
    });

    toast.success("멘토링 신청이 완료되었습니다!");
  };

  // ✅ 매칭 수락 (멘토/멘티 모두 사용)
  const acceptMatch = (mentorId, menteeId) => {
    setMatches((prev) => {
      const updated = prev.map((m) =>
        m.mentorId === mentorId && m.menteeId === menteeId
          ? { ...m, status: "active" }
          : m
      );
      localStorage.setItem("matches", JSON.stringify(updated));
      return updated;
    });
    toast.success("🎉 매칭이 완료되었습니다!");
  };

  // ✅ 매칭 파기
  const terminateMatch = (mentorId, menteeId) => {
    setMatches((prev) => {
      // terminated 상태로 변경하는 대신, 배열에서 완전히 제거
      const updated = prev.filter(
        (m) => !(m.mentorId === mentorId && m.menteeId === menteeId)
      );
      localStorage.setItem("matches", JSON.stringify(updated));
      return updated;
    });
    toast("매칭이 종료되었습니다.", {
      icon: "⚠️",
      style: { background: "#555", color: "#fff" },
    });
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