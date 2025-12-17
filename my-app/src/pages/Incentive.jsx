import React, { useState, useEffect } from 'react';
import QuestList from '../components/QuestList.jsx';
import { useAuth } from '../context/AuthContext';

function IncentivePage() {
    const { user } = useAuth();
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('available');
    const [totalPoints, setTotalPoints] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 다크모드 유지
    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved) setIsDarkMode(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // 퀘스트 데이터 로드
    useEffect(() => {
        if (user) {
            loadQuests();
            loadUserPoints();
        }
    }, [user]);

    const loadQuests = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/quests/member/${user.member_id}`);
            if (response.ok) {
                const data = await response.json();
                setQuests(data);
            }
        } catch (error) {
            console.error('퀘스트 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserPoints = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTotalPoints(data.member.mypoints || 0);
            }
        } catch (error) {
            console.error('포인트 로드 실패:', error);
        }
    };

    // "진행 가능" 퀘스트 목록 (미완료)
    const availableQuests = quests.filter(quest => !quest.is_completed);
    // "완료" 퀘스트 목록
    const completedQuests = quests.filter(quest => quest.is_completed);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className={`p-5 px-10 rounded-none shadow-md flex-grow transition-colors ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            {/* 헤더 영역: 포인트 표시 + 다크모드 토글 */}
            <div className="flex justify-between items-center border-b-2 pb-4 mb-8">
                <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'
                }`}>
                    🏆 나의 포인트: {totalPoints} P
                </h2>

                {/* 다크모드 토글 버튼 */}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        isDarkMode
                            ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                    {isDarkMode ? '☀️ 라이트 모드' : '🌙 다크 모드'}
                </button>
            </div>

            {/* 탭 메뉴 */}
            <div className={`flex justify-center space-x-2 mb-8 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
            }`}>
                <button
                    className={`py-2 px-6 font-semibold rounded-t-lg transition-colors text-base ${
                        activeView === 'available'
                            ? isDarkMode
                                ? 'border-b-4 border-blue-400 text-blue-400'
                                : 'border-b-4 border-blue-500 text-blue-600'
                            : isDarkMode
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveView('available')}
                >
                    진행할 수 있는 퀘스트
                </button>
                <button
                    className={`py-2 px-6 font-semibold rounded-t-lg transition-colors text-base ${
                        activeView === 'completed'
                            ? isDarkMode
                                ? 'border-b-4 border-blue-400 text-blue-400'
                                : 'border-b-4 border-blue-500 text-blue-600'
                            : isDarkMode
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveView('completed')}
                >
                    완료한 퀘스트
                </button>
            </div>

            {/* �� "진행할 수 있는 퀘스트" 탭이 활성화됐을 때 */}
            {activeView === 'available' && (
                <div className="space-y-8">
                    {/* 1. 출석 퀘스트 목록 */}
                    <QuestList
                        title="출석 챌린지"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'ATTENDANCE')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 2. 3대 운동 퀘스트 목록 */}
                    <QuestList
                        title="3대 운동 챌린지"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'EXERCISE')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 3. 친구 초대 퀘스트 목록 */}
                    <QuestList
                        title="친구 초대하기"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'REFERRAL')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 4. 멘토링 퀘스트 목록 */}
                    <QuestList
                        title="멘토링"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'MENTORING')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 5. 식단 관리 퀘스트 목록 */}
                    <QuestList
                        title="식단 관리"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'DIET')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 6. 목표 달성 퀘스트 목록 */}
                    <QuestList
                        title="목표 달성"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'GOAL')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 7. 소셜 활동 퀘스트 목록 */}
                    <QuestList
                        title="소셜 활동"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'SOCIAL')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />

                    {/* 8. 특별 챌린지 퀘스트 목록 */}
                    <QuestList
                        title="특별 챌린지"
                        quests={availableQuests
                            .filter(q => q.quest_type === 'SPECIAL')
                            .map(q => ({
                                id: q.quest_id,
                                title: q.quest_name,
                                description: q.quest_description,
                                points: q.points_reward,
                                isCompleted: q.is_completed,
                                progress: q.current_progress,
                                target: q.target_value
                            }))}
                        onCompleteQuest={() => {}}
                        isCompletable={false}
                        isDarkMode={isDarkMode}
                    />
                </div>
            )}

            {/* "완료한 퀘스트" 탭이 활성화됐을 때 */}
            {activeView === 'completed' && (
                <QuestList
                    title="완료한 퀘스트"
                    quests={completedQuests.map(q => ({
                        id: q.quest_id,
                        title: q.quest_name,
                        description: q.quest_description,
                        points: q.points_reward,
                        isCompleted: q.is_completed,
                        progress: q.current_progress,
                        target: q.target_value
                    }))}
                    onCompleteQuest={() => {}}
                    isCompletable={false}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
}

export default IncentivePage;