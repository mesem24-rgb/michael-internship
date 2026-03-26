import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ItemSkeleton = () => {
  return (
    <div className="container skeleton-container">
      <div className="row">
        <div className="col-md-6 text-center">
          <div className="skeleton skeleton-img"></div>
        </div>
        <div className="col-md-6">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-author"></div>
          <div className="skeleton skeleton-author"></div>
          <div className="skeleton skeleton-price"></div>
        </div>
      </div>
    </div>
  );
};

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatUser = (id) => `User #${String(id).slice(0, 6)}`;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchItem = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
        );

        const foundItem = res.data.find((i) => String(i.nftId) === String(id));

        setItem(foundItem);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <ItemSkeleton />;
  }

  if (!item) {
    return <p style={{ textAlign: "center" }}>Item not found.</p>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title}
                />
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i> {item.views || 0}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i> {item.likes}
                    </div>
                  </div>

                  <p>{item.description || "No description available."}</p>

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`}>
                            <img src={item.authorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.authorId}`}>
                            {formatUser(item.authorId)}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${item.creatorId || item.authorId}`}
                          >
                            <img
                              src={item.creatorImage || item.authorImage}
                              alt={item.creatorName || item.authorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link
                            to={`/author/${item.creatorId || item.authorId}`}
                          >
                            {item.creatorName || item.authorName || "Unknown"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="spacer-40"></div>

                  <h6>Price</h6>
                  <div className="nft-item-price">
                    <img src={EthImage} alt="ETH" />
                    <span>{item.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
