package com.example.stattube;

public class VideoInfo {
    String VideoTitle;
    String VideoViews;
    String VideoLikes;
    String VideoComments;
    String PublishedAT;
    String VideoThumbnail;
    String VideoId;
    String Channel_subs;
    String Channel_vids;
    String Channel_views;

    VideoInfo(String VideoTitle , String VideoViews ,String VideoLikes ,String VideoComments ,String PublishedAT, String VideoThumbnail , String VideoID , String Channel_subs , String Channel_vids , String  Channel_views){
        this.VideoTitle = VideoTitle;
        this.VideoViews = VideoViews;
        this.VideoLikes = VideoLikes;
        this.VideoComments = VideoComments;
        this.PublishedAT = PublishedAT;
        this.VideoThumbnail = VideoThumbnail;
        this.VideoId = VideoID;
        this.Channel_vids = Channel_vids;
        this.Channel_views = Channel_views;
        this.Channel_subs = Channel_subs;
    }

    VideoInfo(String VideoTitle , String VideoViews ,String VideoLikes ,String VideoComments ,String PublishedAT, String VideoThumbnail , String VideoID ){
        this.VideoTitle = VideoTitle;
        this.VideoViews = VideoViews;
        this.VideoLikes = VideoLikes;
        this.VideoComments = VideoComments;
        this.PublishedAT = PublishedAT;
        this.VideoThumbnail = VideoThumbnail;
        this.VideoId = VideoID;

    }



    public String getTitle() {
        return VideoTitle;
    }

    public String getViewCount() {
        return VideoViews;
    }

    public String getLikeCount() {
        return VideoLikes;
    }

    public String getCommentCount() {
        return VideoComments;
    }

    public String getPublishedAT() {
        return PublishedAT;
    }

    public String getVideoId() {
        return VideoId;
    }

    public String getThumbnailUrl() {
        return VideoThumbnail;
    }
}
