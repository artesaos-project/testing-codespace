"use client";
import CategoryCard from "./CategoryCard";
import categories from "@/db-mock/categories.json";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function CategoriesSlider() {
  return (
    <div className="w-[100vw] ml-12 sm:w-[95vw] sm:px-6 md:w-full sm:mx-20 mx-10 relative">
      {/* Custom navigation buttons */}
      <div className="swiper-button-prev absolute translate-y-[200%] sm:-translate-y-1/2 z-10 scale-0 md:scale-75 text-gray-400"></div>
      <div className="swiper-button-next absolute translate-y-[200%] sm:-translate-y-1/2 z-10 scale-0 md:scale-75 text-gray-400"></div>
      <div>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={3.5}
          slidesPerGroup={3}
          breakpointsBase={"window"}
          breakpoints={{
            0: {
              slidesPerView: 3.5,
              slidesPerGroup: 3,
            },
            640: {
              slidesPerView: 4.5,
              slidesPerGroup: 4,
            },
            768: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
            1024: {
              slidesPerView: 6,
              slidesPerGroup: 6,
            },
            1280: {
              slidesPerView: 8,
              slidesPerGroup: 8,
            },
          }}
          onSwiper={(swiper) => console.log(swiper)}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          onPaginationShow={(swiper) => console.log(swiper)}
          pagination={{
            clickable: true,
            type: "custom",
            renderCustom: function (swiper, current, total) {
              // Custom pagination indicator
              let html =
                "<div class='flex w-full absolute top-0'><div class='mx-auto flex bg-gray-200'>";
              for (let i = 0; i < total; i++) {
                if (i === current - 1) {
                  html += `<div class="w-8 h-1 bg-gray-400 rounded-full"></div>`;
                } else {
                  html += `<div class="w-8 h-1"></div>`;
                }
              }
              html += "</div></div>";
              return html;
            },
          }}
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index}>
              <CategoryCard name={cat.name} img={cat.img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default CategoriesSlider;
