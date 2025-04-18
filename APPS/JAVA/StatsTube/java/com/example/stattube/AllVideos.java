package com.example.stattube;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AllVideos extends AppCompatActivity {
    private static final String APPLICATION_NAME = "My_First_Project";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final String API_KEY = "API_KEY";
    RecyclerView Videos ;
    String CHANNEL_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_all_videos);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

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

        Videos = findViewById(R.id.Video_Recycle);

        Intent intent = getIntent();
        CHANNEL_ID = intent.getStringExtra("CHANNEL_ID");

        Videos.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                new ChannelStats().execute();
            }
        });

        new ChannelStats().execute();

    }

    private class ChannelStats extends AsyncTask<String, Void, VideoInfo[]> {

        @Override
        protected VideoInfo[] doInBackground(String... strings) {
            YouTube youtube = getYouTubeService(API_KEY);
            try {

                YouTube.Channels.List request = youtube.channels().list("snippet,contentDetails,statistics");
                request.setId(CHANNEL_ID);
                request.setKey(API_KEY);
                ChannelListResponse response = request.execute();
                Channel channel = response.getItems().get(0);

                List<Video> recent = getRecentVideos(youtube , channel , 10);
                VideoInfo[] VIDEOS = new VideoInfo[10];

                int temp=0;
                for (Video video : recent) {
                    String VidTitle = video.getSnippet().getTitle();
                    String thumbnail = video.getSnippet().getThumbnails().getHigh().getUrl();
                    String viewCount = video.getStatistics().getViewCount().toString();
                    String likeCount = video.getStatistics().getLikeCount().toString();
                    String commentCount = video.getStatistics().getCommentCount().toString();
                    String publishedAt = video.getSnippet().getPublishedAt().toString();
                    String videoId = video.getId();

                    VIDEOS[temp]  = new VideoInfo(VidTitle , viewCount , likeCount , commentCount,publishedAt , thumbnail , videoId);

                    temp=temp+1;
                }

                return VIDEOS;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(VideoInfo[] videos) {

                try {
                    Videos.setLayoutManager(new LinearLayoutManager(AllVideos.this));
                    VideoAdapter adapter = new VideoAdapter(AllVideos.this, videos);
                    Videos.setAdapter(adapter);

                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(AllVideos.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }

        }
    }

    public static YouTube getYouTubeService(String apiKey) {
        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                .build();
    }

    public List<Video> getRecentVideos(YouTube youtubeService, Channel channel, long numberOfVideos) throws IOException {
        // Get the uploads playlist ID
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

}
