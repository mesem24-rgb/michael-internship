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
      setLoading(true);

      try {
        let foundItem = null;

        // 1. Get explore data
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

        // 2. Get detailed item data
        try {
          const detailRes = await axios.get(
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
          );

          const detailData = Array.isArray(detailRes.data)
            ? detailRes.data
            : [detailRes.data];

          const matchedDetail =
            detailData.find(
              (entry) => String(entry?.nftId) === String(nftId)
            ) || null;

          if (matchedDetail) {
            foundItem = { ...foundItem, ...matchedDetail };
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

  // ✅ Loading UI (no missing component)
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;
  }

  if (!item) {
    return <div style={{ textAlign: "center" }}>Item not found</div>;
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
                  <h2>{item.title}</h2>

                  <p>{item.description || "No description available."}</p>

                  <h6>Price</h6>
                  <div className="nft-item-price">
                    <img src={EthImage} alt="ETH" />
                    <span>{Number(item.price || 0).toFixed(2)}</span>
                  </div>

                  {/* Owner */}
                  {item.ownerName && (
                    <div style={{ marginTop: "20px" }}>
                      <h6>Owner</h6>
                      <Link to={`/author/${item.ownerId}`}>
                        {item.ownerName}
                      </Link>
                    </div>
                  )}

                  {/* Creator */}
                  {item.creatorName && (
                    <div style={{ marginTop: "20px" }}>
                      <h6>Creator</h6>
                      <Link to={`/author/${item.creatorId}`}>
                        {item.creatorName}
                      </Link>
                    </div>
                  )}
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
