import { useState, useEffect } from 'react';
import { usePoints } from '../context/PointContext';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5001';

export default function RewardShop() {
    const { totalPoints, subtractPoints } = usePoints();
    const [rewards, setRewards] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedReward, setSelectedReward] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [exchangeHistory, setExchangeHistory] = useState([]);
    const [isDark, setIsDark] = useState(false);
    const [loading, setLoading] = useState(true);

    // 다크모드 유지
    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved) setIsDark(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDark));
    }, [isDark]);

    // 보상 상품 목록 불러오기
    useEffect(() => {
        fetchRewards();
        fetchExchangeHistory();
    }, []);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/rewards`);
            if (!response.ok) throw new Error('보상 목록을 불러오는데 실패했습니다');
            const data = await response.json();
            setRewards(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchExchangeHistory = async () => {
        try {
            const memberId = localStorage.getItem('member_id');
            if (!memberId) return;

            const response = await fetch(`${API_BASE_URL}/api/rewards/exchanges/${memberId}`);
            if (!response.ok) throw new Error('교환 내역을 불러오는데 실패했습니다');
            const data = await response.json();
            setExchangeHistory(data);
        } catch (error) {
            console.error('교환 내역 불러오기 실패:', error);
        }
    };

    // 카테고리 목록
    const categories = ['전체', ...new Set(rewards.map(r => r.category))];

    // 필터링된 보상 목록
    const filteredRewards = selectedCategory === '전체'
        ? rewards
        : rewards.filter(r => r.category === selectedCategory);

    // 교환 가능 여부 확인
    const canExchange = (reward) => {
        return totalPoints >= reward.required_points && reward.stock_quantity > 0;
    };

    // 교환 확인 모달 열기
    const openConfirmModal = (reward) => {
        if (!canExchange(reward)) {
            if (totalPoints < reward.required_points) {
                toast.error(`포인트가 부족합니다! (${reward.required_points - totalPoints}P 부족)`);
            } else {
                toast.error('재고가 없습니다!');
            }
            return;
        }
        setSelectedReward(reward);
        setShowConfirmModal(true);
    };

    // 교환 실행
    const handleExchange = async () => {
        if (!selectedReward) return;

        const memberId = localStorage.getItem('member_id');
        if (!memberId) {
            toast.error('로그인이 필요합니다');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/exchange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    member_id: parseInt(memberId),
                    reward_id: selectedReward.reward_id
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || '교환에 실패했습니다');
            }

            await response.json();

            // 프론트엔드 포인트 차감
            subtractPoints(selectedReward.required_points);

            // 보상 목록과 교환 내역 다시 불러오기
            await fetchRewards();
            await fetchExchangeHistory();

            toast.success(`${selectedReward.reward_name} 교환 완료!`);
            setShowConfirmModal(false);
            setSelectedReward(null);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen p-5 px-10 rounded-none shadow-md flex-grow transition-colors flex items-center justify-center ${
                isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
                <div className="text-center">
                    <div className="text-6xl mb-4">🔄</div>
                    <p className="text-xl">보상 상품을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-5 px-10 rounded-none shadow-md flex-grow transition-colors ${
            isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
            {/* 헤더 */}
            <div className="mb-8">
                <div className="flex items-center justify-between border-b-2 pb-4 mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            포인트 교환소
                        </h1>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-base mt-2`}>포인트로 다양한 보상을 받아가세요!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* 교환 내역 버튼 */}
                        <button
                            onClick={() => setShowHistoryModal(true)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                isDark
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                        >
                            교환 내역
                        </button>

                        {/* 다크모드 토글 */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                isDark
                                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                        >
                            {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}
                        </button>

                        {/* 포인트 표시 */}
                        <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-300'}`}>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>보유 포인트</div>
                            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}P</div>
                        </div>
                    </div>
                </div>

                {/* 카테고리 필터 */}
                <div className={`flex gap-2 flex-wrap border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedCategory === category
                                ? isDark
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                : isDark
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* 보상 상품 그리드 */}
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRewards.map((reward) => {
                        const affordable = canExchange(reward);

                        return (
                            <div
                                key={reward.reward_id}
                                className={`rounded-lg p-6 border relative ${isDark
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-300'
                                    } ${!affordable && 'opacity-60'}`}
                            >
                                {/* 재고 부족 표시 */}
                                {reward.stock_quantity === 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        품절
                                    </div>
                                )}

                                {/* 아이콘 */}
                                <div className="text-6xl mb-4 text-center">{reward.icon}</div>

                                {/* 상품명 */}
                                <h3 className="text-xl font-bold mb-2 text-center">{reward.reward_name}</h3>

                                {/* 설명 */}
                                <p className={`text-sm mb-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {reward.description}
                                </p>

                                {/* 카테고리 */}
                                <div className="flex justify-center mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {reward.category}
                                    </span>
                                </div>

                                {/* 포인트 & 재고 */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {reward.required_points}P
                                    </div>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        재고: {reward.stock_quantity}개
                                    </div>
                                </div>

                                {/* 교환 버튼 */}
                                <button
                                    onClick={() => openConfirmModal(reward)}
                                    disabled={!affordable}
                                    className={`w-full py-3 rounded-lg font-bold transition-colors ${affordable
                                        ? isDark
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : isDark
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {totalPoints < reward.required_points
                                        ? `${reward.required_points - totalPoints}P 부족`
                                        : reward.stock_quantity === 0
                                            ? '품절'
                                            : '교환하기'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 교환 확인 모달 */}
            {showConfirmModal && selectedReward && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-lg p-8 max-w-md w-full ${isDark
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-300'
                            }`}
                    >
                        <div className="text-center">
                            <div className="text-7xl mb-4">{selectedReward.icon}</div>
                            <h2 className="text-2xl font-bold mb-2">{selectedReward.reward_name}</h2>
                            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {selectedReward.description}
                            </p>

                            <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span>필요 포인트</span>
                                    <span className="font-bold text-red-500">{selectedReward.required_points}P</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span>보유 포인트</span>
                                    <span className="font-bold">{totalPoints}P</span>
                                </div>
                                <div className={`border-t my-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
                                <div className="flex items-center justify-between">
                                    <span>교환 후 포인트</span>
                                    <span className="font-bold text-green-500">
                                        {totalPoints - selectedReward.required_points}P
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-yellow-500 mb-6">
                                ⚠️ 교환 후에는 취소할 수 없습니다
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-colors ${isDark
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                                        }`}
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleExchange}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-colors ${isDark
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                >
                                    교환 확정
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 교환 내역 모달 */}
            {showHistoryModal && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowHistoryModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-lg p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto ${isDark
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">교환 내역</h2>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                                    }`}
                            >
                                닫기
                            </button>
                        </div>

                        {exchangeHistory.length === 0 ? (
                            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-lg">아직 교환 내역이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {exchangeHistory.map((exchange) => (
                                    <div
                                        key={exchange.exchange_id}
                                        className={`p-4 rounded-lg border ${isDark
                                            ? 'bg-gray-700 border-gray-600'
                                            : 'bg-gray-50 border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{exchange.icon}</div>
                                            <div className="flex-1">
                                                <div className="font-bold text-lg">{exchange.reward_name}</div>
                                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {new Date(exchange.exchanged_at).toLocaleString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-red-500">-{exchange.used_points}P</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
