"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  EffectCreative,
  Autoplay,
  Keyboard,
  Pagination,
  Navigation,
} from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { SelectedStatusContext } from "@/components/contexts";
import { SelectedStatusContextType } from "@/types";

export default function StatusContent() {
  const { selectedStatus, setSelectedStatus } = useContext(
    SelectedStatusContext
  ) as SelectedStatusContextType;

  const sliderRef = useRef<SwiperRef>(null);

  // To update the Swiper slider widget when switching between different posts
  const [sliderKey, setSliderKey] = useState(0);

  const progressCircle = useRef<SVGSVGElement>(null);
  const progressContent = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    setSliderKey((prevKey) => prevKey + 1);
  }, [selectedStatus]);

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty("--progress", `${1 - progress}`);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  if (!selectedStatus) {
    return (
      <figure className="text-center h-full hidden lg:flex items-center justify-center">
        <img
          className="max-w-sm block dark:hidden"
          src="/not-selected-chat.svg"
          alt="..."
        />
        <img
          className="max-w-sm hidden dark:block"
          src="/not-selected-chat-light.svg"
          alt="..."
        />
      </figure>
    );
  }

  return (
    <div className="h-full flex items-center z-50 inset-0 fixed bg-background lg:bg-transparent lg:relative p-4 lg:p-0">
      <div
        className="w-14 h-14 cursor-pointer bg-background shadow rounded-full hidden lg:flex items-center justify-center"
        onClick={handlePrev}
      >
        <ArrowLeft />
      </div>
      <div
        onClick={() => setSelectedStatus(null)}
        className="absolute right-4 p-3 z-50 top-4 text-white opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </div>
      <Swiper
        ref={sliderRef}
        key={sliderKey}
        effect={"creative"}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        modules={[EffectCreative, Autoplay, Keyboard, Pagination, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
      >
        {selectedStatus.images.map((image, key) => (
          <SwiperSlide
            key={key}
            style={{ backgroundImage: `url(${image})` }}
            className="bg-cover bg-center rounded-lg"
          >
            <div className="px-4 py-8 flex items-end justify-center h-full text-lg text-white/90">
              Slide 1
            </div>
          </SwiperSlide>
        ))}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
      <div
        className="w-14 h-14 cursor-pointer bg-background shadow rounded-full hidden lg:flex items-center justify-center"
        onClick={handleNext}
      >
        <ArrowRight />
      </div>
    </div>
  );
}
