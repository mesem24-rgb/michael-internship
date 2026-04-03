import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const { nftId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);

      try {
        let foundItem = null;

        // 1. Pull from explore API first (this is already working in your app)
        try {
          const exploreRes = await axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
          );

          const exploreItems = Array.isArray(exploreRes.data)
            ? exploreRes.data
            : [];

          foundItem =
            exploreItems.find(
              (entry) => String(entry.nftId) === String(nftId)
            ) || null;
        } catch (err) {
          console.error("Explore API failed:", err);
        }

        // 2. Try itemDetails API for richer owner/creator fields
        try {
          const detailUrls = [
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`,
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?id=${nftId}`,
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails/${nftId}`,
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails",
          ];

          for (const url of detailUrls) {
            try {
              const detailRes = await axios.get(url);
              const detailData = Array.isArray(detailRes.data)
                ? detailRes.data
                : [detailRes.data];

              const matchedDetail =
                detailData.find(
                  (entry) => String(entry?.nftId) === String(nftId)
                ) || null;

              if (matchedDetail) {
                // Merge detail fields on top of explore item if both exist
                foundItem = { ...foundItem, ...matchedDetail };
                break;
              }
            } catch (innerErr) {
              console.log("Item details URL failed:", url);
            }
          }
        } catch (err) {
          console.error("ItemDetails API failed:", err);
        }

        setItem(foundItem);
      } catch (error) {
        console.error("Error fetching item:", error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchItem();
    }
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  <div
                    className="skeleton skeleton-img"
                    style={{
                      width: "100%",
                      height: "500px",
                      borderRadius: "12px",
                    }}
                  ></div>
                </div>

                <div className="col-md-6">
                  <div className="item_info">
                    <div
                      className="skeleton skeleton-text short"
                      style={{
                        width: "260px",
                        height: "32px",
                        marginBottom: "20px",
                      }}
                    ></div>

                    <div className="item_info_counts">
                      <div
                        className="skeleton skeleton-text"
                        style={{
                          width: "80px",
                          height: "18px",
                          marginRight: "12px",
                        }}
                      ></div>
                      <div
                        className="skeleton skeleton-text"
                        style={{
                          width: "80px",
                          height: "18px",
                        }}
                      ></div>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <div
                        className="skeleton skeleton-text"
                        style={{
                          width: "100%",
                          height: "18px",
                          marginBottom: "10px",
                        }}
                      ></div>
                      <div
                        className="skeleton skeleton-text"
                        style={{
                          width: "92%",
                          height: "18px",
                          marginBottom: "10px",
                        }}
                      ></div>
                      <div
                        className="skeleton skeleton-text"
                        style={{
                          width: "84%",
                          height: "18px",
                          marginBottom: "10px",
                        }}
                      ></div>
                    </div>

                    <div style={{ marginTop: "24px" }}>
                      <div
                        className="skeleton skeleton-text short"
                        style={{
                          width: "60px",
                          height: "18px",
                          marginBottom: "12px",
                        }}
                      ></div>
                      <div className="item_author">
                        <div
                          className="skeleton skeleton-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>

                    <div
                      className="skeleton skeleton-text short"
                      style={{
                        width: "60px",
                        height: "18px",
                        marginBottom: "12px",
                      }}
                    ></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{
                        width: "120px",
                        height: "28px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container text-center">
              <h3>Item not found</h3>
            </div>
          </section>
        </div>
      </div>
    );
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
                  style={{
                    width: "100%",
                    maxHeight: "600px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  <h2>
                    {item.title}
                    {item.tag !== undefined && item.tag !== null
                      ? ` #${item.tag}`
                      : ""}
                  </h2>

                  <div className="item_info_counts">
                    {item.views !== undefined && item.views !== null && (
                      <div className="item_info_views">
                        <i className="fa fa-eye"></i>
                        {item.views}
                      </div>
                    )}

                    {item.likes !== undefined && item.likes !== null && (
                      <div className="item_info_like">
                        <i className="fa fa-heart"></i>
                        {item.likes}
                      </div>
                    )}
                  </div>

                  <p>{item.description || "No description available."}</p>

                  <div>
                    {(item.ownerName || item.ownerImage || item.ownerId) && (
                      <div style={{ marginBottom: "20px" }}>
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={`/author/${item.ownerId}`}>
                              <img
                                className="lazy"
                                src={item.ownerImage}
                                alt={item.ownerName || "Owner"}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={`/author/${item.ownerId}`}>
                              {item.ownerName || "Unknown Owner"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {(item.creatorName || item.creatorImage || item.creatorId) && (
                      <div style={{ marginBottom: "20px" }}>
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={`/author/${item.creatorId}`}>
                              <img
                                className="lazy"
                                src={item.creatorImage}
                                alt={item.creatorName || "Creator"}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={`/author/${item.creatorId}`}>
                              {item.creatorName || "Unknown Creator"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {!item.ownerName && !item.creatorName && item.authorId && (
                      <div style={{ marginBottom: "20px" }}>
                        <h6>Author</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={`/author/${item.authorId}`}>
                              <img
                                className="lazy"
                                src={item.authorImage}
                                alt="Author"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={`/author/${item.authorId}`}>View Author</Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="spacer-40"></div>

                  <h6>Price</h6>
                  <div className="nft-item-price">
                    <img src={EthImage} alt="ETH" />
                    <span>{Number(item.price || 0).toFixed(2)}</span>
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
