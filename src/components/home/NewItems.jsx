import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(expiryDate).getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return <div className="de_countdown">{timeLeft}</div>;
};

const SkeletonCard = () => {
  return (
    <div style={{ padding: "0 10px" }}>
      <div className="nft__item">
        <div className="author_list_pp">
          <div className="skeleton skeleton-circle"></div>
        </div>
        <div className="skeleton skeleton-badge"></div>
        <div className="nft__item_wrap">
          <div className="skeleton skeleton-img"></div>
        </div>
        <div className="nft__item_info">
          <div className="skeleton skeleton-text short"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
        );
        console.log("NEW ITEMS:", response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching new items:", error);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  const NextArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.5)",
        color: "white",
        borderRadius: "50%",
        padding: "10px",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        right: "-20px",
        zIndex: 10,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      ▶
    </div>
  );

  const PrevArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.5)",
        color: "white",
        borderRadius: "50%",
        padding: "10px",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: "-20px",
        zIndex: 10,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      ◀
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="text-center">
          <h2>New Items</h2>
          <div className="small-border bg-color-2"></div>
        </div>

        {loading ? (
          <Slider {...settings}>
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </Slider>
        ) : (
          <Slider {...settings}>
            {items.map((item) => (
              <div key={item.id} style={{ padding: "0 10px" }}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`}>
                      <img src={item.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  <Countdown expiryDate={item.expiryDate} />

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                      </div>
                    </div>

                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="nft__item_preview"
                        alt=""
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default NewItems;
