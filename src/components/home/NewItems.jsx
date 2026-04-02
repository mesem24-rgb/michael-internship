import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        console.log("NEW ITEMS API:", res.data);
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching new items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Arrow = ({ onClick, direction }) => (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "next" ? "right" : "left"]: "-25px",
        zIndex: 10,
        cursor: "pointer",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        borderRadius: "50%",
        padding: "10px",
        lineHeight: 1,
      }}
    >
      {direction === "next" ? "▶" : "◀"}
    </div>
  );

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: items.length > 4,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: <Arrow direction="next" />,
      prevArrow: <Arrow direction="prev" />,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 576, settings: { slidesToShow: 1 } },
      ],
    }),
    [items.length]
  );

  const formatCountdown = (expiryDate) => {
    if (!expiryDate) return null;

    const distance = expiryDate - now;

    if (distance <= 0) return "Ended";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="text-center">
          <h2>New Items</h2>
          <div className="small-border bg-color-2"></div>
        </div>

        <Slider {...settings}>
          {loading
            ? [...Array(4)].map((_, index) => <NewItemSkeleton key={index} />)
            : items.map((item, index) => {
                const countdown = formatCountdown(item.expiryDate);

                return (
                  <div
                    key={item.nftId || item.id || index}
                    style={{ padding: "0 10px" }}
                  >
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={`Creator: ${item.title}`}
                        >
                          <img
                            src={item.authorImage}
                            alt="author"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      {countdown && <div className="de_countdown">{countdown}</div>}

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>

                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href="/" onClick={(e) => e.preventDefault()}>
                                <i className="fa fa-facebook fa-lg"></i>
                              </a>
                              <a href="/" onClick={(e) => e.preventDefault()}>
                                <i className="fa fa-twitter fa-lg"></i>
                              </a>
                              <a href="/" onClick={(e) => e.preventDefault()}>
                                <i className="fa fa-envelope fa-lg"></i>
                              </a>
                            </div>
                          </div>
                        </div>

                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            alt={item.title}
                            className="nft__item_preview"
                            onError={() =>
                              console.log("NFT IMAGE FAILED:", item.nftImage)
                            }
                            style={{
                              width: "100%",
                              height: "280px",
                              objectFit: "cover",
                              display: "block",
                              borderRadius: "8px",
                            }}
                          />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>

                        <div className="nft__item_price">
                          {Number(item.price).toFixed(2)} ETH
                        </div>

                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </Slider>
      </div>
    </section>
  );
};

const NewItemSkeleton = () => (
  <div style={{ padding: "0 10px" }}>
    <div className="nft__item">
      <div className="author_list_pp">
        <div
          className="skeleton skeleton-circle"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
          }}
        ></div>
      </div>

      <div
        className="skeleton skeleton-text short"
        style={{
          width: "120px",
          height: "24px",
          marginBottom: "12px",
        }}
      ></div>

      <div className="nft__item_wrap">
        <div
          className="skeleton skeleton-img"
          style={{
            width: "100%",
            height: "280px",
            borderRadius: "8px",
          }}
        ></div>
      </div>

      <div className="nft__item_info" style={{ marginTop: "12px" }}>
        <div
          className="skeleton skeleton-text short"
          style={{ height: "22px", marginBottom: "10px" }}
        ></div>
        <div
          className="skeleton skeleton-text"
          style={{ height: "18px", width: "90px", marginBottom: "10px" }}
        ></div>
        <div
          className="skeleton skeleton-text"
          style={{ height: "18px", width: "70px" }}
        ></div>
      </div>
    </div>
  </div>
);

export default NewItems;
