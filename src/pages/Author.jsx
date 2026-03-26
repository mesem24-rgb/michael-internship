import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
        );

        const authorItems = res.data.filter(
          (item) => String(item.authorId) === String(id),
        );

        setItems(authorItems);

        if (authorItems.length > 0) {
          setAuthor({
            name: authorItems[0].authorName || "Unknown",
            username: authorItems[0].authorUsername || "unknownuser",
            image: authorItems[0].authorImage,
            wallet: authorItems[0].authorWallet || "Not available",
            followers: authorItems[0].authorFollowers || 0,
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching author data:", err);
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading author...</p>;
  }

  if (!author) {
    return <p style={{ textAlign: "center" }}>Author not found</p>;
  }

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
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author.image} alt={author.name} />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.name}
                          <span className="profile_username">
                            @{author.username}
                          </span>
                          <span id="wallet" className="profile_wallet">
                            {author.wallet}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {author.followers} followers
                      </div>
                      <button className="btn-main">Follow</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems items={items} />
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
