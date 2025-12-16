import React from 'react';

function QuestList(props) {
    const { isDarkMode = false } = props;

    return (
        <div className="mt-8">
            <h3 className={`text-xl font-semibold mb-4 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
                {props.title}
                <span className={`text-base font-normal ml-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    ({props.quests.length}개)
                </span>
            </h3>

            <ul className="space-y-3">

                {props.quests.length === 0 && (
                    <li className={`rounded-lg p-4 text-center shadow-sm ${
                        isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-gray-400'
                            : 'bg-white border border-gray-200 text-gray-500'
                    }`}>
                        목록이 비었습니다.
                    </li>
                )}

                {props.quests.map(quest => (
                    <li
                        key={quest.id}
                        className={`rounded-lg p-4 shadow-sm transition-all hover:shadow-md ${
                            isDarkMode
                                ? quest.isCompleted
                                    ? 'bg-gray-800 border border-gray-700 opacity-60'
                                    : 'bg-gray-800 border border-gray-700'
                                : quest.isCompleted
                                    ? 'bg-gray-50 border border-gray-200 opacity-60'
                                    : 'bg-white border border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <strong className={`text-base font-semibold ${
                                    isDarkMode
                                        ? quest.isCompleted
                                            ? 'line-through text-gray-500'
                                            : 'text-gray-100'
                                        : quest.isCompleted
                                            ? 'line-through text-gray-600'
                                            : 'text-gray-900'
                                }`}>
                                    {quest.title} (+{quest.points} P)
                                </strong>
                                <p className={`text-sm mt-1 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {quest.description}
                                </p>

                                {/* 진행도 표시 */}
                                {quest.target && (
                                    <div className="mt-2">
                                        <div className={`flex items-center justify-between text-xs mb-1 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            <span>진행도</span>
                                            <span>{quest.progress || 0} / {quest.target}</span>
                                        </div>
                                        <div className={`w-full rounded-full h-2 ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                        }`}>
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    quest.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                                }`}
                                                style={{
                                                    width: `${Math.min(((quest.progress || 0) / quest.target) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 완료 상태 표시 */}
                            {quest.isCompleted && (
                                <div className="ml-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        isDarkMode
                                            ? 'bg-green-900 text-green-300'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        ✓ 완료
                                    </span>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestList;