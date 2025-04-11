const Pagination = (props) => {
  const { page, setPage, limit, setLimit, totalCount } = props;

  const changeLimit = (e) => {
    const { value } = e.target;
    setLimit(parseInt(value)); // бо мабуть потім треба це все додавати і віднімати
    setPage(1); // якщо змінив ліміт то на першу сторінку переходимо
    //   parseInt() – це вбудований метод в мові програмування JavaScript, що дозволяє перетворювати рядок у ціле число
  };

  const nextPage = () => {
    if (page * limit <= totalCount) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount); // Math.min(a, b) — це JavaScript-функція, яка повертає менше з двох (або більше ніж два числа) чисел.

  return (
    <div className="pagination-box">
      <div className="pagination-content">
        <div className="left-context-block">
          <span>Products per page:</span>
          <select
            className="products-per-page"
            name="products-per-page"
            id="products-per-page"
            value={limit}
            onChange={(e) => changeLimit(e)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
        <div className="right-content-block">
          <span className="pagination-text">
            {start}/{end}
            of {totalCount}
          </span>

          <button
            disabled={page === 1}
            className="pagination-btn"
            onClick={() => prevPage()}
          >
            <svg
              style={{ fill: page === 1 && "gray" }}
              className="left-arrow"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 330 330"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  id="XMLID_222_"
                  d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
                />{" "}
              </g>
            </svg>
          </button>

          <span>{page}</span>
          <button
            disabled={page * limit >= totalCount}
            className="pagination-btn"
            onClick={() => nextPage()}
          >
            <svg
              style={{ fill: page * limit >= totalCount && "gray" }}
              className="right-arrow"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 330 330"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  id="XMLID_222_"
                  d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
                />{" "}
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
