import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function LandingPage() {
  const images = [
    "https://brandsriver.com/cdn/shop/files/Add_a_heading_5_2000x.gif?v=1733605759",
    "https://brandsriver.com/cdn/shop/files/Add_a_heading_5_2000x.gif?v=1733605759",
    "https://brandsriver.com/cdn/shop/files/Add_a_heading_5_2000x.gif?v=1733605759",
  ];
  return (
    <div>
      <Carousel
        autoPlay
        interval={3000}
        showIndicators={true}
        showStatus={false}
        stopOnHover={false}
        infiniteLoop
        showThumbs={false}
        showArrows={false}
        className="carousel-wrapper "
      >
        {images.map((img, idx) => {
          return (
            <div key={idx} className="max-h-[90vh] w-full ">
              <img
                src={img}
                className="max-h-[90vh]  w-full object-fill"
                alt="Image 1"
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default LandingPage;
