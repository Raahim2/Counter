package com.example.stattube;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeRequestInitializer;
import com.google.api.services.youtube.model.Channel;
import com.google.api.services.youtube.model.ChannelListResponse;
import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.PlaylistItemListResponse;
import com.google.api.services.youtube.model.Video;
import com.squareup.picasso.Picasso;

import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class ChannelStastics extends AppCompatActivity {
    private static final String APPLICATION_NAME = "My_First_Project";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final String API_KEY = "API_KEY";
    String CHANNEL_ID;
    String CHANNEL_TITLE;
    Channel channel;

    public TextView CHANNEL_NAME;
    public TextView CHANNEL_SUBSCRIBERS;

    public TextView TOTAL_VIEWS;
    public TextView TOTAL_VIDEOS;
    public TextView AVG_SUB;
    public TextView AVG_VIEWS;

    public ImageView LOGO;
    public RecyclerView RECYCLE_VIEW_VIDEOS;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_channel_stastics);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }

        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        // Basic Setup

        Intent intent = getIntent();
        CHANNEL_ID = intent.getStringExtra("CHANNEL_ID");
        CHANNEL_TITLE = intent.getStringExtra("CHANNEL_NAME");

        CHANNEL_NAME = findViewById(R.id.Channel_Name);
        CHANNEL_SUBSCRIBERS = findViewById(R.id.Channel_Subscribers);

        TOTAL_VIEWS = findViewById(R.id.Views_Count);
        TOTAL_VIDEOS = findViewById(R.id.Likes_Count);
        AVG_SUB = findViewById(R.id.Comments_Count);
        AVG_VIEWS = findViewById(R.id.Avg_views);
        LOGO = findViewById(R.id.Channel_Logo2);
        RECYCLE_VIEW_VIDEOS = findViewById(R.id.Video_Recycle);

        CHANNEL_NAME.setText(CHANNEL_TITLE);



        new ChannelStats().execute();
    }

    private class ChannelStats extends AsyncTask<String, Void, Channelnfo> {

        @Override
        protected Channelnfo doInBackground(String... strings) {
            YouTube youtube = getYouTubeService(API_KEY);
            try {

                YouTube.Channels.List request = youtube.channels().list("snippet,contentDetails,statistics");
                request.setId(CHANNEL_ID);
                request.setKey(API_KEY);
                ChannelListResponse response = request.execute();
                channel = response.getItems().get(0);

                List<Video> recent = getRecentVideos(youtube , channel , 5);
                VideoInfo[] VIDEOS = new VideoInfo[5];

                int temp=0;
                for (Video video : recent) {
                    String VidTitle = video.getSnippet().getTitle();
                    String thumbnail = video.getSnippet().getThumbnails().getHigh().getUrl();
                    String viewCount = video.getStatistics().getViewCount().toString();
                    String likeCount = video.getStatistics().getLikeCount().toString();
                    String commentCount = video.getStatistics().getCommentCount().toString();
                    String publishedAt = video.getSnippet().getPublishedAt().toString();
                    String videoId = video.getId();
                    String Channel_vids = channel.getStatistics().getVideoCount().toString();
                    String Channel_views = channel.getStatistics().getViewCount().toString();
                    String Channel_subs = channel.getStatistics().getSubscriberCount().toString();

                    VIDEOS[temp]  = new VideoInfo(VidTitle , viewCount , likeCount , commentCount,publishedAt , thumbnail , videoId , Channel_subs , Channel_vids , Channel_views);

                    temp=temp+1;
                }

                Channelnfo CHANNEL = new Channelnfo(getSubscribers(channel) , getViews(channel) , getVideoCount(channel)  , getAvgViewCount(channel) ,getAvgSubCount(channel), getChannelLogo(channel) , VIDEOS);

                return CHANNEL;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(Channelnfo channel) {
            if (channel != null) {
                try {
                    CHANNEL_SUBSCRIBERS.setText(channel.Subscribers);
                    TOTAL_VIEWS.setText(channel.Views);
                    TOTAL_VIDEOS.setText(channel.VideoCount);
                    AVG_SUB.setText(channel.AvgSubs);
                    AVG_VIEWS.setText(channel.AvgViews);
                    setChannelLogo(LOGO , channel.LogoURL);

                    RECYCLE_VIEW_VIDEOS.setLayoutManager(new LinearLayoutManager(ChannelStastics.this));
                    VideoAdapter adapter = new VideoAdapter(ChannelStastics.this, channel.videos);
                    RECYCLE_VIEW_VIDEOS.setAdapter(adapter);

                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(ChannelStastics.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            } else {
                Toast.makeText(ChannelStastics.this, "Failed to fetch channel statistics.", Toast.LENGTH_LONG).show();
            }
        }
    }

    public static YouTube getYouTubeService(String apiKey) {
        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                .build();
    }

    public String formatCount(String countStr) {
        try {
            // Parse the count from the string
            long count = Long.parseLong(countStr);

            // Format the count based on its size
            if (count >= 1_000_000_000) {
                return String.format("%.1fB", count / 1_000_000_000.0);
            } else if (count >= 1_000_000) {
                return String.format("%.1fM", count / 1_000_000.0);
            } else if (count >= 1_000) {
                return String.format("%.1fK", count / 1_000.0);
            } else {
                return countStr; // Return the original count if it's less than 1000
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return countStr;
        }
    }

    public long calculateChannelAge(String publishedAt) {
        try {
            LocalDate creationDate = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                creationDate = LocalDate.parse(publishedAt, DateTimeFormatter.ISO_DATE_TIME);
                LocalDate currentDate = LocalDate.now();
                return ChronoUnit.DAYS.between(creationDate, currentDate);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            return 1;
        }
        return 1;
    }

    public void showA(View v ){
        Intent intent = new Intent(this, DeepAnalysis.class);
        intent.putExtra("INFO", "OP1");

        intent.putExtra("CHANNEL_NAME", channel.getSnippet().getTitle()); // Channel name
        intent.putExtra("CHANNEL_LOGO", channel.getSnippet().getThumbnails().getDefault().getUrl()); // Channel logo URL
        intent.putExtra("CHANNEL_VIDS", channel.getStatistics().getVideoCount().toString()); // Number of videos
        intent.putExtra("CHANNEL_SUBS", channel.getStatistics().getSubscriberCount().toString()); // Number of subscribers
        intent.putExtra("CHANNEL_VIEWS", channel.getStatistics().getViewCount().toString());
        intent.putExtra("CHANNEL_AGE", Long.toString(calculateChannelAge(channel.getSnippet().getPublishedAt().toString())));

        startActivity(intent);
    }

    public void showB(View v){
        Intent intent = new Intent(this, DeepAnalysis.class);
        intent.putExtra("INFO", "OP2");

        intent.putExtra("CHANNEL_NAME", channel.getSnippet().getTitle()); // Channel name
        intent.putExtra("CHANNEL_LOGO", channel.getSnippet().getThumbnails().getDefault().getUrl()); // Channel logo URL
        intent.putExtra("CHANNEL_VIDS", channel.getStatistics().getVideoCount().toString()); // Number of videos
        intent.putExtra("CHANNEL_SUBS", channel.getStatistics().getSubscriberCount().toString()); // Number of subscribers
        intent.putExtra("CHANNEL_VIEWS", channel.getStatistics().getViewCount().toString());
        intent.putExtra("CHANNEL_AGE", Long.toString(calculateChannelAge(channel.getSnippet().getPublishedAt().toString())));

        startActivity(intent);
    }

    public void showC(View v ){
        Intent intent = new Intent(this, DeepAnalysis.class);
        intent.putExtra("INFO", "OP3");

        intent.putExtra("CHANNEL_NAME", channel.getSnippet().getTitle()); // Channel name
        intent.putExtra("CHANNEL_LOGO", channel.getSnippet().getThumbnails().getDefault().getUrl()); // Channel logo URL
        intent.putExtra("CHANNEL_VIDS", channel.getStatistics().getVideoCount().toString()); // Number of videos
        intent.putExtra("CHANNEL_SUBS", channel.getStatistics().getSubscriberCount().toString()); // Number of subscribers
        intent.putExtra("CHANNEL_VIEWS", channel.getStatistics().getViewCount().toString());
        intent.putExtra("CHANNEL_AGE", Long.toString(calculateChannelAge(channel.getSnippet().getPublishedAt().toString())));

        startActivity(intent);
    }

    public void showD(View v){
        Intent intent = new Intent(this, DeepAnalysis.class);
        intent.putExtra("INFO", "OP4");

        intent.putExtra("CHANNEL_NAME", channel.getSnippet().getTitle()); // Channel name
        intent.putExtra("CHANNEL_LOGO", channel.getSnippet().getThumbnails().getDefault().getUrl()); // Channel logo URL
        intent.putExtra("CHANNEL_VIDS", channel.getStatistics().getVideoCount().toString()); // Number of videos
        intent.putExtra("CHANNEL_SUBS", channel.getStatistics().getSubscriberCount().toString()); // Number of subscribers
        intent.putExtra("CHANNEL_VIEWS", channel.getStatistics().getViewCount().toString());
        intent.putExtra("CHANNEL_AGE", Long.toString(calculateChannelAge(channel.getSnippet().getPublishedAt().toString())));
        intent.putExtra("CHANNEL_ID" , channel.getId());

        startActivity(intent);
    }





    public String getSubscribers(Channel channel) {
        BigInteger count = channel.getStatistics().getSubscriberCount();
        return formatCount(count.toString());
    }

    public String getViews(Channel channel) {
        BigInteger count = channel.getStatistics().getViewCount();
        return formatCount(count.toString());
    }

    public String getVideoCount(Channel channel) {
        BigInteger count = channel.getStatistics().getVideoCount();
        return formatCount(count.toString());
    }

    public String getAvgViewCount(Channel channel) {
        BigInteger count1 = channel.getStatistics().getViewCount();
        BigInteger count2 = channel.getStatistics().getVideoCount();

        if (count2.equals(BigInteger.ZERO)) {
            return "0";
        }

        BigInteger avg = count1.divide(count2);
        return formatCount(avg.toString());
    }

    public String getAvgSubCount(Channel channel) {
        BigInteger count1 = channel.getStatistics().getSubscriberCount();
        BigInteger count2 = channel.getStatistics().getVideoCount();

        if (count2.equals(BigInteger.ZERO)) {
            return "0";
        }

        BigInteger avg = count1.divide(count2);
        return formatCount(avg.toString());
    }

    public String getChannelLogo(Channel channel){
        return channel.getSnippet().getThumbnails().getHigh().getUrl();
    }

    public void setChannelLogo(ImageView imageView, String logoUrl) {
        Picasso.get().load(logoUrl).into(imageView);
    }

    public List<Video> getRecentVideos(YouTube youtubeService, Channel channel, long numberOfVideos) throws IOException {
        // Get the uploads playlist ID
        if(Integer.parseInt(channel.getStatistics().getVideoCount().toString()) < numberOfVideos){
            numberOfVideos = Integer.parseInt(channel.getStatistics().getVideoCount().toString());
        }
        String uploadsPlaylistId = channel.getContentDetails()
                .getRelatedPlaylists()
                .getUploads();

        YouTube.PlaylistItems.List playlistItemsListRequest = youtubeService.playlistItems()
                .list("snippet,contentDetails");
        playlistItemsListRequest.setPlaylistId(uploadsPlaylistId);
        playlistItemsListRequest.setMaxResults(numberOfVideos);

        PlaylistItemListResponse playlistItemListResponse = playlistItemsListRequest.execute();
        List<PlaylistItem> playlistItems = playlistItemListResponse.getItems();

        // Convert PlaylistItems to Videos
        List<Video> videos = new ArrayList<>();
        for (PlaylistItem item : playlistItems) {
            String videoId = item.getContentDetails().getVideoId();
            YouTube.Videos.List videoRequest = youtubeService.videos().list("snippet,statistics");
            videoRequest.setId(videoId);
            videos.addAll(videoRequest.execute().getItems());
        }

        return videos;
    }

    public void Allvideo(View V){
        Intent intent = new Intent(this, AllVideos.class);
        intent.putExtra("CHANNEL_ID", CHANNEL_ID);
        intent.putExtra("CHANNEL_NAME" , CHANNEL_TITLE);
        startActivity(intent);
    }



}
