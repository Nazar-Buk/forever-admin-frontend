// import { useMediaQuery } from "react-responsive";

import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#FF8042", "#0088FE", "#c40000", "#FFBB28"];

const PieChartWithPaddingAngle = ({ chartsData }) => {
  // const isDesktop = useMediaQuery({ minWidth: 1200 }); // true, якщо екран ≥1200px // для прикладу

  const { data } = chartsData;

  return (
    <div className="wrap-cloudinary-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" // центр по ширині контейнера
            cy="50%" // центр по висоті контейнера
            innerRadius="40%" // задавай у відсотках щос чарт адаптувався
            outerRadius="60%" // задавай у відсотках щос чарт адаптувався
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value" // // ключ, за яким беремо значення з об'єкта
            // label={
            //   isDesktop
            //     ? // label добавляє рисочки із підказками
            //       ({ name, value }) => {
            //         return `${name}: ${value} credits`;
            //       }
            //     : false
            //   // `${name}: ${value.toFixed(2)} (${(percent * 100).toFixed(1)}%)` // для прикладу
            // }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]} // гарантує, що індекс не вийде за межі масиву.
                // Наприклад: якщо у тебе 6 секторів, то кольори повторяться: 0→0, 1→1, 2→2, 3→3, 4→0, 5→1…
              />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartWithPaddingAngle;
