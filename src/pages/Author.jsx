import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Author = () => {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);

      try {
        console.log("ROUTE AUTHOR ID:", authorId);

        let foundAuthor = null;

        // 1) Try dedicated authors endpoint first
        try {
          const res = await axios.get(
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?id=${authorId}`
          );

          console.log("AUTHORS API:", res.data);

          const authors = Array.isArray(res.data) ? res.data : [res.data];

          foundAuthor =
            authors.find(
              (entry) => String(entry?.authorId) === String(authorId)
            ) || null;
        } catch (err) {
          console.log("authors endpoint failed, using fallback data");
        }

        // 2) Fallback: build author from item APIs
        const [exploreRes, newItemsRes, topSellersRes] = await Promise.allSettled([
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
          ),
        ]);

        const exploreItems =
          exploreRes.status === "fulfilled" && Array.isArray(exploreRes.value.data)
            ? exploreRes.value.data
            : [];

        const newItems =
          newItemsRes.status === "fulfilled" && Array.isArray(newItemsRes.value.data)
            ? newItemsRes.value.data
            : [];

        const topSellers =
          topSellersRes.status === "fulfilled" && Array.isArray(topSellersRes.value.data)
            ? topSellersRes.value.data
            : [];

        // Merge all NFT item sources you want shown on the author page
        const allItems = [...exploreItems, ...newItems];

        // Match selected person as author OR creator OR owner
        const rawAuthorItems = allItems.filter((item) => {
          return (
            String(item.authorId) === String(authorId) ||
            String(item.creatorId) === String(authorId) ||
            String(item.ownerId) === String(authorId)
          );
        });

        // Remove duplicates by nftId
        const uniqueAuthorItems = Array.from(
          new Map(
            rawAuthorItems.map((item) => [
              String(item.nftId),
              {
                ...item,
              },
            ])
          ).values()
        );

        const firstMatch = uniqueAuthorItems[0] || null;

        const sellerMatch =
          topSellers.find(
            (seller) =>
              String(seller.authorId) === String(authorId) ||
              String(seller.creatorId) === String(authorId) ||
              String(seller.ownerId) === String(authorId)
          ) || null;

        // If authors endpoint did not return enough usable data, build it from matched NFT data
        if (!foundAuthor && (firstMatch || sellerMatch)) {
          foundAuthor = {
            authorId: Number(authorId),
            authorName:
              sellerMatch?.authorName ||
              firstMatch?.authorName ||
              firstMatch?.creatorName ||
              firstMatch?.ownerName ||
              "Unknown Author",
            tag:
              sellerMatch?.authorName
                ? sellerMatch.authorName.toLowerCase().replace(/\s+/g, "")
                : firstMatch?.authorName
                ? firstMatch.authorName.toLowerCase().replace(/\s+/g, "")
                : firstMatch?.creatorName
                ? firstMatch.creatorName.toLowerCase().replace(/\s+/g, "")
                : firstMatch?.ownerName
                ? firstMatch.ownerName.toLowerCase().replace(/\s+/g, "")
                : `author${authorId}`,
            address:
              firstMatch?.address ||
              firstMatch?.creatorAddress ||
              firstMatch?.ownerAddress ||
              "Wallet address unavailable",
            authorImage:
              sellerMatch?.authorImage ||
              firstMatch?.authorImage ||
              firstMatch?.creatorImage ||
              firstMatch?.ownerImage ||
              "",
            followers: sellerMatch?.followers || 0,
            nftCollection: uniqueAuthorItems,
          };
        }

        // If authors endpoint succeeded, still replace nftCollection with the full associated set
        if (foundAuthor) {
          foundAuthor = {
            ...foundAuthor,
            nftCollection: uniqueAuthorItems,
            authorImage:
              foundAuthor.authorImage ||
              firstMatch?.authorImage ||
              firstMatch?.creatorImage ||
              firstMatch?.ownerImage ||
              "",
            authorName:
              foundAuthor.authorName ||
              firstMatch?.authorName ||
              firstMatch?.creatorName ||
              firstMatch?.ownerName ||
              "Unknown Author",
          };
        }

        setAuthor(foundAuthor);
        setFollowers(foundAuthor?.followers || 0);
      } catch (err) {
        console.error("Error fetching author:", err);
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthor();
    }
  }, [authorId]);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowers((prev) => Math.max(prev - 1, 0));
    } else {
      setFollowers((prev) => prev + 1);
    }

    setIsFollowing((prev) => !prev);
  };

  const copyWallet = () => {
    if (author?.address && author.address !== "Wallet address unavailable") {
      navigator.clipboard.writeText(author.address);
    }
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {loading ? (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div
                          className="skeleton skeleton-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                          }}
                        ></div>

                        <div className="profile_name" style={{ marginTop: "20px" }}>
                          <div
                            className="skeleton skeleton-text short"
                            style={{
                              width: "220px",
                              height: "24px",
                              marginBottom: "12px",
                            }}
                          ></div>
                          <div
                            className="skeleton skeleton-text"
                            style={{
                              width: "180px",
                              height: "18px",
                              marginBottom: "10px",
                            }}
                          ></div>
                          <div
                            className="skeleton skeleton-text"
                            style={{
                              width: "320px",
                              height: "18px",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : author ? (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img
                          src={author.authorImage}
                          alt={author.authorName}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                        <i className="fa fa-check"></i>

                        <div className="profile_name">
                          <h4>
                            {author.authorName}
                            <span className="profile_username">@{author.tag}</span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button
                              id="btn_copy"
                              title="Copy Text"
                              onClick={copyWallet}
                              disabled={author.address === "Wallet address unavailable"}
                            >
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">{followers} followers</div>
                        <Link
                          to="#"
                          className="btn-main"
                          onClick={(e) => {
                            e.preventDefault();
                            handleFollowToggle();
                          }}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h3>Author not found.</h3>
                )}
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems
                    items={author?.nftCollection || []}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
