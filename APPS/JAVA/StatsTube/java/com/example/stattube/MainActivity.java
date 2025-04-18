
package com.example.stattube;

import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.textfield.TextInputEditText;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeRequestInitializer;
import com.google.api.services.youtube.model.Channel;
import com.google.api.services.youtube.model.ChannelListResponse;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    public String Type;
    public LinearLayout op1;
    public LinearLayout op2;


    private ListView YTChannels;
    LayoutInflater inflater;
    private LinearLayout YTVideos;
    private TextInputEditText queryEditText;

    private static final String APPLICATION_NAME = "My_First_Project";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final String API_KEY = "API_KEY";




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Type = "Channel";

        YTChannels = findViewById(R.id.YTChannels);
        YTVideos = findViewById(R.id.YTVideos);
        queryEditText = findViewById(R.id.query);
        op1 = findViewById(R.id.op1);
        op2 = findViewById(R.id.op2);

        YTVideos = findViewById(R.id.YTVideos);
        inflater = LayoutInflater.from(this);

        new FetchYouTubeChannelsTask().execute("Code");

    }

    public void Search(View v) {
        try{
            String query = queryEditText.getText().toString();
            if(Type.equals("Channel")){
                if (!query.isEmpty()) {
                    new GetChannelsTask().execute(query);
                } else {
                    Toast.makeText(this, "Please enter a search query", Toast.LENGTH_SHORT).show();
                }
            }
            else{
                if (!query.isEmpty()) {
                    try{
                        new GetVideosTask().execute(query);
                    }catch (Exception e){
                        Toast.makeText(this, "Error : "+e, Toast.LENGTH_SHORT).show();

                    }
                } else {
                    Toast.makeText(this, "Please enter a search query", Toast.LENGTH_SHORT).show();
                }
            }
        }catch (Exception e){
            Toast.makeText(this, "Error : "+e, Toast.LENGTH_SHORT).show();

        }

    }

    public class FetchYouTubeChannelsTask extends AsyncTask<String, Void, List<Channel>> {



        @Override
        protected List<Channel> doInBackground(String... queries) {
            try {
                YouTube youtubeService = new YouTube.Builder(
                        GoogleNetHttpTransport.newTrustedTransport(),
                        JSON_FACTORY,
                        null)
                        .setApplicationName(APPLICATION_NAME)
                        .build();

                YouTube.Search.List search = youtubeService.search().list("snippet");
                search.setKey(API_KEY);
                search.setQ(queries[0]);
                search.setType("channel");
                search.setMaxResults(5L);

                SearchListResponse searchResponse = search.execute();
                List<SearchResult> searchResults = searchResponse.getItems();
                List<Channel> channels = new ArrayList<>();

                for (SearchResult searchResult : searchResults) {
                    String channelId = searchResult.getSnippet().getChannelId();
                    YouTube.Channels.List channelRequest = youtubeService.channels().list("snippet,statistics");
                    channelRequest.setKey(API_KEY);
                    channelRequest.setId(channelId);

                    List<Channel> channelResponse = channelRequest.execute().getItems();
                    if (!channelResponse.isEmpty()) {
                        channels.add(channelResponse.get(0));
                    }
                }
                return channels;
            } catch (GeneralSecurityException | IOException e) {
                return null;
            }
        }

        @Override
        protected void onPostExecute(List<Channel> channels) {
            try{
                if (channels != null) {
                    for (Channel channel : channels) {
                        // Display channel information
                        queryEditText.setText("Chaannel :" +channel.getSnippet().getTitle());
                    }
                }
            }catch (Exception e){
                queryEditText.setText("Error" +e );
            }

        }
    }


    public class GetChannelsTask extends AsyncTask<String, Void, List<String>> {

        @Override
        protected List<String> doInBackground(String... params) {
            String query = params[0];
            List<String> resultList = new ArrayList<>();

            YouTube youtubeService = getYouTubeService(API_KEY);

            try {
                // Search for channels
                YouTube.Search.List searchRequest = youtubeService.search().list("snippet");
                searchRequest.setQ(query);
                searchRequest.setType("channel");
                searchRequest.setMaxResults(10L);
                searchRequest.setKey(API_KEY);

                SearchListResponse searchResponse = searchRequest.execute();
                List<SearchResult> searchResults = searchResponse.getItems();

                for (SearchResult searchResult : searchResults) {
                    String channelId = searchResult.getId().getChannelId();
                    String channelTitle = searchResult.getSnippet().getTitle();

                    // Get channel statistics
                    YouTube.Channels.List channelsRequest = youtubeService.channels().list("statistics");
                    channelsRequest.setId(channelId);
                    channelsRequest.setKey(API_KEY);

                    ChannelListResponse channelsResponse = channelsRequest.execute();
                    List<Channel> channels = channelsResponse.getItems();

                    if (!channels.isEmpty()) {
                        BigInteger subscriberCount = channels.get(0).getStatistics().getSubscriberCount();
                        resultList.add(channelTitle);
                        resultList.add(channelId);
                        resultList.add(subscriberCount.toString());
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return resultList;
        }


        @Override
        protected void onPostExecute(List<String> result) {
            try {
                ChannelAdapter adapter = new ChannelAdapter(MainActivity.this, result);
                YTChannels.setAdapter(adapter);
            }catch (Exception e){
                Toast.makeText(MainActivity.this, "Error: "+e, Toast.LENGTH_SHORT).show();
            }

        }
    }

    public class GetVideosTask extends AsyncTask<String, Void, VideoInfo[]> {


        @Override
        protected VideoInfo[] doInBackground(String... params) {
            String query = params[0];
            List<VideoInfo> resultList = new ArrayList<>();

            YouTube youtubeService = getYouTubeService(API_KEY);

            try {
                // Search for videos
                YouTube.Search.List searchRequest = youtubeService.search().list("snippet");
                searchRequest.setQ(query);
                searchRequest.setType("video");
                searchRequest.setMaxResults(5L);
                searchRequest.setKey(API_KEY);

                SearchListResponse searchResponse = searchRequest.execute();
                List<SearchResult> searchResults = searchResponse.getItems();

                for (SearchResult searchResult : searchResults) {
                    String videoId = searchResult.getId().getVideoId();
                    String videoTitle = searchResult.getSnippet().getTitle();
                    String publishedAt = searchResult.getSnippet().getPublishedAt().toString();
                    String videoThumbnail = searchResult.getSnippet().getThumbnails().getDefault().getUrl();

                    // Get video statistics
                    YouTube.Videos.List videosRequest = youtubeService.videos().list("statistics");
                    videosRequest.setId(videoId);
                    videosRequest.setKey(API_KEY);

                    VideoListResponse videosResponse = videosRequest.execute();
                    List<Video> videos = videosResponse.getItems();

                    if (!videos.isEmpty()) {
                        BigInteger viewCount = videos.get(0).getStatistics().getViewCount();
                        BigInteger likeCount = videos.get(0).getStatistics().getLikeCount();
                        BigInteger commentCount = videos.get(0).getStatistics().getCommentCount();

                        // Create VideoInfo object
                        VideoInfo videoInfo = new VideoInfo(
                                videoTitle,
                                viewCount.toString(),
                                likeCount.toString(),
                                commentCount.toString(),
                                publishedAt.toString(),
                                videoThumbnail,
                                videoId
                        );

                        resultList.add(videoInfo);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return resultList.toArray(new VideoInfo[0]);
        }

        @Override
        protected void onPostExecute(VideoInfo[] result) {
            YTVideos.removeAllViews();
            for (int i = 0; i < result.length; i++) {
                View itemView = inflater.inflate(R.layout.video, YTVideos, false);

                TextView Title = itemView.findViewById(R.id.Video_Title);
                TextView Video_Views = itemView.findViewById(R.id.Video_Views);
                TextView Video_likes = itemView.findViewById(R.id.Video_likes);
                TextView Video_comments = itemView.findViewById(R.id.Video_Comments);
                ImageView Video_Thumbnail = itemView.findViewById(R.id.Video_Thumbnail);
                String vidid = result[i].getVideoId();


                Title.setText(result[i].getTitle());
                Video_Views.setText(formatCount(result[i].getViewCount()));
                Video_likes.setText(formatCount(result[i].getLikeCount()));
                Video_comments.setText(formatCount(result[i].getCommentCount()));
                Picasso.get().load(result[i].getThumbnailUrl()).into(Video_Thumbnail);

                itemView.setOnClickListener(v -> {
                    Intent intent = new Intent(MainActivity.this, VideoStatistics.class);
                    intent.putExtra("VIDEO_ID", vidid);
                    intent.putExtra("CHANNEL_VIEW", "100000");
                    intent.putExtra("CHANNEL_SUBS", "1000");
                    intent.putExtra("CHANNEL_VIDS", "100");


                    startActivity(intent);

                    MainActivity.this.startActivity(intent);
                });

                YTVideos.addView(itemView);

            }


        }

    }

    public static YouTube getYouTubeService(String apiKey) {
        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                .build();
    }

    public void setTypeChannel(View v){
        Type="Channel";
        YTChannels.setVisibility(View.VISIBLE);
        YTVideos.setVisibility(View.GONE);
        op1.setBackgroundColor(Color.rgb(135 ,199,74));
        op2.setBackgroundColor(Color.WHITE);

    }

    public void setTypeVideo(View v){
        Type="Video";
        YTChannels.setVisibility(View.GONE);
        YTVideos.setVisibility(View.VISIBLE);
        op2.setBackgroundColor(Color.rgb(135 ,199,74));
        op1.setBackgroundColor(Color.WHITE);
    }

    public static String formatCount(String countStr) {
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
            // Handle the case where countStr is not a valid number
            e.printStackTrace();
            return countStr;
        }
    }


}
