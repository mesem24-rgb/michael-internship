import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching new items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  // ✅ ONLY ONE SETTINGS OBJECT
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12">
            <Slider {...settings}>
              {loading
                ? new Array(4).fill(0).map((_, index) => (
                    <NewItemSkeleton key={index} />
                  ))
                : items.map((item) => (
                    <div key={item.nftId}>
                      <div className="nft__item">
                        {/* AUTHOR */}
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${item.authorId}`}
                            title={`Creator: ${item.authorName || "Unknown"}`}
                          >
                            <img
                              src={item.authorImage}
                              alt={item.authorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        {/* IMAGE */}
                        <div className="nft__item_wrap">
                          <Link to={`/item-details/${item.nftId}`}>
                            <img
                              src={item.nftImage}
                              className="nft__item_preview"
                              alt={item.title}
                            />
                          </Link>
                        </div>

                        {/* INFO */}
                        <div className="nft__item_info">
                          <Link to={`/item-details/${item.nftId}`}>
                            <h4>{item.title}</h4>
                          </Link>

                          <div className="nft__item_price">
                            {item.price || "0.00 ETH"}
                          </div>

                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{item.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

const NewItemSkeleton = () => (
  <div>
    <div className="nft__item">
      <div className="author_list_pp">
        <div className="skeleton skeleton-circle"></div>
      </div>

      <div className="nft__item_wrap">
        <div className="skeleton skeleton-img"></div>
      </div>

      <div className="nft__item_info">
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
);

export default NewItems;
