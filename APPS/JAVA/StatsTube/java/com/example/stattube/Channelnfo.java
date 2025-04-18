package com.example.stattube;


public class Channelnfo {
    String Subscribers;
    String Views;
    String VideoCount;
    String AvgViews;
    String AvgSubs;
    String LogoURL;
    String Title;
    String Age;
    VideoInfo [] videos;

    Channelnfo(String subscribers , String Views , String VideoCount , String AvgViews , String AvgSubs , String LogoURL , VideoInfo[] videos){
        this.Subscribers = subscribers;
        this.Views = Views;
        this.VideoCount = VideoCount;
        this.AvgViews = AvgViews;
        this.AvgSubs = AvgSubs;
        this.LogoURL = LogoURL;
        this.videos = videos;
    }

    Channelnfo(String title , String subscribers , String LogoURL , String Views , String age  , String VideoCount){
        this.Subscribers = subscribers;
        this.Views = Views;
        this.VideoCount = VideoCount;
        this.LogoURL = LogoURL;
        this.Title = title;
        this.Age = age;
    }

    public String getTitle() {
        return Title;
    }
}
