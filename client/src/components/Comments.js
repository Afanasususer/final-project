import React, { useEffect, useState } from "react";
import { List, Input as AntInput, Avatar as AntAvatar, Tooltip, Card as AntCard, Empty, Image as AntImage } from "antd";
import { SendOutlined, LikeOutlined, LikeFilled, CommentOutlined, CloseCircleOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar as MuiAvatar, Button as MuiButton, IconButton } from "@mui/material";
import moment from "moment";

const { TextArea } = AntInput;

const Comments = ({ project, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${project._id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [project._id]);

  const addComment = () => {
    if (newComment.trim() !== "" || image) {
      const updatedComments = [
        ...comments,
        {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage
          },
          comment: newComment,
          image: image,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedByCurrentUser: false,
        }
      ];
      setComments(updatedComments);
      localStorage.setItem(`comments_${project._id}`, JSON.stringify(updatedComments));
      setNewComment("");
      setImage(null);
    }
  };

  const handleLike = (index) => {
    const newComments = [...comments];
    const likedComment = newComments[index];

    if (likedComment.likedByCurrentUser) {
      likedComment.likes -= 1;
      likedComment.likedByCurrentUser = false;
    } else {
      likedComment.likes += 1;
      likedComment.likedByCurrentUser = true;
    }

    setComments(newComments);
    localStorage.setItem(`comments_${project._id}`, JSON.stringify(newComments));
  };

  const handleDelete = (index) => {
    const newComments = comments.filter((_, commentIndex) => commentIndex !== index);
    setComments(newComments);
    localStorage.setItem(`comments_${project._id}`, JSON.stringify(newComments));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <AntCard bordered={false} style={{ borderRadius: 8 }}>
      <List
        className="comment-list"
        header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
        itemLayout="horizontal"
        dataSource={comments}
        locale={{ 
          emptyText: (
            <Empty 
              description="No comments yet. Be the first to share your thoughts!" 
              image={<CommentOutlined style={{ fontSize: 50 }} />} 
            />
          )
        }}
        renderItem={(item, index) => (
          <li>
            <List.Item
              actions={[
                <Tooltip key="comment-like" title="Like">
                  <span onClick={() => handleLike(index)} className="like-icon">
                    {React.createElement(item.likedByCurrentUser ? LikeFilled : LikeOutlined)}
                    <span className="comment-action">{item.likes}</span>
                  </span>
                </Tooltip>,
                item.user._id === user._id && (
                  <Tooltip key="comment-delete" title="Delete">
                    <span onClick={() => handleDelete(index)} className="delete-icon">
                      <DeleteOutlined />
                    </span>
                  </Tooltip>
                )
              ]}
            >
              <List.Item.Meta
                avatar={<AntAvatar src={item.user.profileImage} alt={item.user.firstName} />}
                title={<span>{item.user.firstName} {item.user.lastName}</span>}
                description={(
                  <div>
                    <p>{item.comment}</p>
                    {item.image && (
                      <AntImage.PreviewGroup>
                        <AntImage src={item.image} alt="comment" style={{ display: 'block', marginTop: '10px', width: '400px', height: 'auto', borderRadius: '8px' }} />
                      </AntImage.PreviewGroup>
                    )}
                  </div>
                )}
              />
              <div>{moment(item.createdAt).fromNow()}</div>
            </List.Item>
          </li>
        )}
      />
      <div style={{ marginTop: 16, position: 'relative' }}>
        <TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          style={{ marginTop: 16, borderRadius: '8px', paddingRight: image ? '80px' : '16px' }}
        />
        {image && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
            <img src={image} alt="Selected" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
            <CloseCircleOutlined onClick={removeImage} style={{ position: 'absolute', top: '-5px', right: '-5px', cursor: 'pointer', color: 'red' }} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: '8px' }}>
        <MuiButton
          variant="contained"
          component="label"
          startIcon={<UploadOutlined />}
          style={{ borderRadius: '8px' }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </MuiButton>
        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<SendOutlined />}
          onClick={addComment}
          style={{ borderRadius: '8px' }}
        >
          Add Comment
        </MuiButton>
      </div>
    </AntCard>
  );
};

export default Comments;
 

//  hadi a7ssen wehda tal db + te9dar tmsa7 lcomment dyalk >> done alhamdullilah 


//  ghadi nbda ngad f previeew inchaelah .. .. 


// done lhamdullilah .. preview message done .. 