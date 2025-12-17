import { useState } from "react";

export default function NewPostModal({ onClose, onSubmit, darkMode, type, userId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  // 운동 루틴용 상태
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", rest: "", tip: "" }
  ]);

  // 식단용 상태
  const [meals, setMeals] = useState([
    { time: "", menu: "", calories: "" }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const baseData = {
      title,
      content,
      category,
      likes: 0,
      author: "사용자",
      authorId: userId,
      createdAt: new Date().toISOString()
    };

    if (type === "routine") {
      // 빈 운동 제거
      const validExercises = exercises.filter(ex => ex.name && ex.sets && ex.reps);
      onSubmit({
        ...baseData,
        exercises: validExercises.length > 0 ? validExercises : undefined
      });
    } else {
      // 빈 식사 제거
      const validMeals = meals.filter(meal => meal.time && meal.menu);
      const totalCalories = validMeals.reduce((sum, meal) => sum + (parseInt(meal.calories) || 0), 0);
      onSubmit({
        ...baseData,
        meals: validMeals.length > 0 ? validMeals : undefined,
        calories: totalCalories || undefined
      });
    }

    onClose();
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", rest: "", tip: "" }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addMeal = () => {
    setMeals([...meals, { time: "", menu: "", calories: "" }]);
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const updateMeal = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const routineCategories = ["가슴", "등", "어깨", "하체", "팔"];
  const dietCategories = ["다이어트", "벌크업", "유지", "건강식"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div
        className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          } p-8 rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto my-8`}
      >
        <h3 className="text-2xl font-bold mb-4">
          {type === "routine" ? "새 루틴 작성" : "새 식단 작성"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full p-2 rounded border outline-none ${darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
              }`}
          />

          {/* 카테고리 선택 */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={`w-full p-2 rounded border outline-none ${darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
              }`}
          >
            <option value="">카테고리 선택</option>
            {(type === "routine" ? routineCategories : dietCategories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* 설명 */}
          <textarea
            placeholder="간단한 설명을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-2 h-20 rounded border resize-none outline-none ${darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
              }`}
          ></textarea>

          {/* 운동 루틴 입력 */}
          {type === "routine" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">운동 목록</label>
                <button
                  type="button"
                  onClick={addExercise}
                  className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  + 운동 추가
                </button>
              </div>
              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">운동 {index + 1}</span>
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="운동명 (예: 벤치프레스)"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, "name", e.target.value)}
                        className={`p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                      <input
                        type="text"
                        placeholder="세트 (예: 3)"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", e.target.value)}
                        className={`p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                      <input
                        type="text"
                        placeholder="횟수 (예: 10-12회)"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", e.target.value)}
                        className={`p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                      <input
                        type="text"
                        placeholder="휴식 (예: 90초)"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(index, "rest", e.target.value)}
                        className={`p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                      <input
                        type="text"
                        placeholder="팁 (선택사항)"
                        value={exercise.tip}
                        onChange={(e) => updateExercise(index, "tip", e.target.value)}
                        className={`col-span-2 p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 식단 입력 */}
          {type === "diet" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">식단 구성</label>
                <button
                  type="button"
                  onClick={addMeal}
                  className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  + 식사 추가
                </button>
              </div>
              <div className="space-y-3">
                {meals.map((meal, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">식사 {index + 1}</span>
                      {meals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMeal(index)}
                          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="시간 (예: 아침)"
                        value={meal.time}
                        onChange={(e) => updateMeal(index, "time", e.target.value)}
                        className={`p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                      <input
                        type="number"
                        placeholder="칼로리 (예: 500)"
                        value={meal.calories}
                        onChange={(e) => updateMeal(index, "calories", e.target.value)}
                        className={`p-2 text-sm rounded border outline-none ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      />
                      <textarea
                        placeholder="메뉴 (예: 현미밥, 닭가슴살, 샐러드)"
                        value={meal.menu}
                        onChange={(e) => updateMeal(index, "menu", e.target.value)}
                        className={`col-span-2 p-2 text-sm rounded border resize-none outline-none h-16 ${darkMode
                            ? "bg-gray-600 text-white border-gray-500 placeholder-gray-400"
                            : "bg-white text-black border-gray-300"
                          }`}
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${darkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-400 hover:bg-gray-500 text-white"
                }`}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}