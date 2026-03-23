import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const CollectionSkeleton = () => {
  return (
    <div style={{ padding: "0 10px" }}>
      <div className="nft_coll">
        <div className="nft_wrap skeleton skeleton-img"></div>

        <div className="nft_coll_pp skeleton skeleton-circle"></div>

        <div className="nft_coll_info">
          <div className="skeleton skeleton-text short"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
    </div>
  );
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        console.log("API DATA:", response.data);
        setCollections(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Slider settings
  const NextArrow = ({ className, style, onClick }) => {
  return (
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
        transform: "translateY(-50%)",
        right: "-25px",   
        zIndex: 2,
      }}
      onClick={onClick}
    >
      ▶
    </div>
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  return (
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
        transform: "translateY(-50%)",
        left: "-25px",    
        zIndex: 2,
      }}
      onClick={onClick}
    >
      ◀
    </div>
  );
};
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
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="text-center">
          <h2>Hot Collections</h2>
          <div className="small-border bg-color-2"></div>
        </div>

        {loading ? (
          <Slider {...settings}>
        {[...Array(4)].map((_, i) => (
          <CollectionSkeleton key={i} />
        ))}
      </Slider>
        ) : (
          
          <Slider {...settings}>
            {collections.map((collection) => (
              <div key={collection.id} style={{ padding: "0 10px" }}>
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <Link to={`/item-details/${collection.nftId}`}>
                      <img
                        src={collection.nftImage}
                        className="lazy img-fluid"
                        alt={collection.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link to="/author">
                      <img
                        className="lazy pp-coll"
                        src={collection.authorImage}
                        alt="author"
                      />
                    </Link>
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft_coll_info">
                    <Link to="/explore">
                      <h4>{collection.title}</h4>
                    </Link>
                    <span>ID: {collection.nftId}</span>
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

export default HotCollections;

          
