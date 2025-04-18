package com.example.stattube;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeRequestInitializer;
import com.google.api.services.youtube.model.Channel;
import com.google.api.services.youtube.model.ChannelListResponse;
import com.google.api.services.youtube.model.Video;
import com.squareup.picasso.Picasso;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class CompairChannel extends AppCompatActivity {
    private static final String APPLICATION_NAME = "My_First_Project";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final String API_KEY = "API_KEY";
    Channelnfo CH1;
    Channelnfo CH2;


    LinearLayout Compair;
    TextView channel1_name;
    TextView channel2_name;
    TextView channel1_subs;
    TextView channel2_subs;
    ImageView channel1_logo;
    ImageView channel2_logo;

    String[] LABELS = {
            "Total Subscribers",
            "Total Views",
            "Total Videos",
            "Average Views",
            "Average Subscribers",
            "Views Per Subscribers",
            "Channel Age",
            "Views Per Day",
            "Subscribers Per Day",
            "Estimate Next Video in",
            "Impression",
            "Total"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_compair_channel);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });


        channel1_name = findViewById(R.id.ch1_name);
        channel2_name = findViewById(R.id.ch2_name);
        channel1_subs = findViewById(R.id.ch1_subs);
        channel2_subs = findViewById(R.id.ch2_subs);
        channel1_logo = findViewById(R.id.ch1_logo);
        channel2_logo = findViewById(R.id.ch2_logo);

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
        Compair = findViewById(R.id.comparision);

        Intent intent= getIntent();
        String id1 = intent.getStringExtra("CHANNEL1_ID");
        String id2 = intent.getStringExtra("CHANNEL2_ID");

        try {
            new CompairChannelData().execute(id1, id2);
        }catch (Exception e){
            Toast.makeText(CompairChannel.this, "Error: "+e, Toast.LENGTH_SHORT).show();
        }




    }



    public class CompairChannelData extends AsyncTask<String, Void, Channel[]> {


        @Override
        protected Channel[] doInBackground(String... channelIds) {
            if (channelIds.length < 2) {
                Toast.makeText(CompairChannel.this, "At least two channel IDs are required.", Toast.LENGTH_SHORT).show();
                return null;
            }

            Channel[] channels = new Channel[2];

            try {
                YouTube youTube = getYouTubeService(API_KEY);
                for (int i = 0; i < 2; i++) {
                    YouTube.Channels.List request = youTube.channels().list("snippet,contentDetails,statistics");
                    request.setId(channelIds[i]);
                    request.setKey(API_KEY);
                    ChannelListResponse response = request.execute();

                    if (response.getItems() != null && !response.getItems().isEmpty()) {
                        channels[i] = response.getItems().get(0);
                    } else {
                        Toast.makeText(CompairChannel.this, "No channels found for ID: " + channelIds[i], Toast.LENGTH_SHORT).show();

                    }
                }
            } catch (IOException e) {
                Toast.makeText(CompairChannel.this, "Error fetching data" , Toast.LENGTH_SHORT).show();

            }

            return channels;
        }

        @Override
        protected void onPostExecute(Channel[] channels) {
            if (channels != null && channels.length == 2) {
                for (int i = 0; i < channels.length; i++) {
                    Channel channel = channels[i];
                    if (channel != null) {
                        String title = channel.getSnippet().getTitle();
                        String logoUrl = channel.getSnippet().getThumbnails().getDefault().getUrl();
                        String numVideos = channel.getStatistics().getVideoCount().toString();
                        String numViews = channel.getStatistics().getViewCount().toString();
                        String numSubscribers = channel.getStatistics().getSubscriberCount().toString();
                        String channelAge = String.valueOf(calculateChannelAge(channel.getSnippet().getPublishedAt().toString()));

                        Channelnfo channelInfo = new Channelnfo(title, numSubscribers, logoUrl, numViews, channelAge, numVideos);

                        if (i == 0) {
                            CH1 = channelInfo;
                        } else if (i == 1) {
                            CH2 = channelInfo;
                        }
                    } else {
                        Toast.makeText(CompairChannel.this, "Channel " + (i + 1) + " is null", Toast.LENGTH_SHORT).show();
                    }
                }

                try {
                    channel1_name.setText(CH1.getTitle());
                    channel2_name.setText(CH2.Title);
                    channel1_subs.setText(formatCount(CH1.Subscribers));
                    channel2_subs.setText(formatCount(CH2.Subscribers));
                    setChannelLogo(channel1_logo , CH1.LogoURL);
                    setChannelLogo(channel2_logo , CH2.LogoURL);

                    LayoutInflater inflater = LayoutInflater.from(CompairChannel.this);

                    ArrayList<String> Ch1_details = getdetails(CH1);
                    ArrayList<String> Ch2_details = getdetails(CH2);
                    ArrayList<Integer> Ch1_score = getscore();
                    ArrayList<Integer> Ch2_score= invertArrayList(Ch1_score);

                    Ch1_score.add(sumArrayList(Ch1_score));
                    Ch2_score.add(sumArrayList(Ch2_score));


                    for (int i = 0; i <LABELS.length; i++) {
                        View itemView = inflater.inflate(R.layout.compair_item, Compair, false);


                        TextView textViewtop = itemView.findViewById(R.id.heading);
                        TextView c1_per = itemView.findViewById(R.id.c1_performance);
                        TextView c2_per = itemView.findViewById(R.id.c2_performance);

                        TextView c1_score = itemView.findViewById(R.id.c1_score);
                        TextView c2_score = itemView.findViewById(R.id.c2_score);

                        textViewtop.setText(LABELS[i]);
                        c1_per.setText(Ch1_details.get(i));
                        c2_per.setText(Ch2_details.get(i));

                        c1_score.setText("SCORE : " + Ch1_score.get(i));
                        c2_score.setText("SCORE : " + Ch2_score.get(i));


                        Compair.addView(itemView);
                    }



                }catch (Exception e){
                    Toast.makeText(CompairChannel.this, "Error: "+e, Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(CompairChannel.this, "Channels array is null or does not contain two channels", Toast.LENGTH_SHORT).show();

            }
        }
    }

    public static YouTube getYouTubeService(String apiKey) {
        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                .build();
    }

    public static int sumArrayList(ArrayList<Integer> list) {
        int sum = 0;
        for (Integer num : list) {
            sum += num;
        }
        return sum;
    }

    public ArrayList getdetails(Channelnfo c){
        ArrayList<String> e = new ArrayList<>();

        e.add(formatCount(c.Subscribers));
        e.add(formatCount(c.Views));
        e.add(formatCount(c.VideoCount));
        e.add(formatCount(String.valueOf(getAvg(c.Views , c.VideoCount ))));

        e.add(formatCount(String.valueOf(getAvg(c.Subscribers , c.VideoCount ))));
        e.add(formatCount(String.valueOf(getAvg(c.Views , c.Subscribers ))));
        e.add(formatCount(c.Age) + "Days"); //days

        e.add(formatCount(String.valueOf(getAvg(c.Views , c.Age ))));
        e.add(formatCount(String.valueOf(getAvg(c.Subscribers, c.Age ))));
        e.add(formatCount(String.valueOf(getAvg(c.Age , c.VideoCount ))) + "Days") ;//days
        e.add(formatCount(String.valueOf(Long.parseLong(c.VideoCount)*20)));
        e.add("");
        return  e;
    }

    public ArrayList<Long> intdetails(Channelnfo c) {
        ArrayList<Long> e = new ArrayList<>();

        e.add(Long.parseLong(c.Subscribers));
        e.add(Long.parseLong(c.Views));
        e.add(Long.parseLong(c.VideoCount));
        e.add(getAvg( c.Views, c.VideoCount));
        e.add(getAvg(c.Subscribers, c.VideoCount));
        e.add(getAvg(c.Views, c.Subscribers));
        e.add(Long.parseLong(c.Age)); // days
        e.add(getAvg(c.Views, c.Age));
        e.add(getAvg(c.Subscribers, c.Age));
        e.add(getAvg(c.Age, c.VideoCount)); // days
        e.add(Long.parseLong(c.VideoCount) * 20);

        return e;
    }

    public static ArrayList<Integer> invertArrayList(ArrayList<Integer> list) {
        ArrayList<Integer> invertedList = new ArrayList<>();
        for (Integer num : list) {
            if (num == 5) {
                invertedList.add(0);
            } else if (num == 0) {
                invertedList.add(5);
            } else {
                // Optional: handle unexpected values
                invertedList.add(num); // Or throw an exception if needed
            }
        }
        return invertedList;
    }

    public ArrayList<Integer> getscore() {
        ArrayList<Long> ch1 = intdetails(CH1);
        ArrayList<Long> ch2 = intdetails(CH2);

        ArrayList<Integer> score = new ArrayList<>();
        for (int i = 0; i < ch1.size(); i++) {
            if (ch1.get(i) > ch2.get(i)) {
                score.add(5);
            } else {
                score.add(0);
            }
        }

        return score;
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

    public long getAvg(String a , String b){
        long ac = Long.parseLong(a);
        long bc = Long.parseLong(b);
        return  (ac / bc);
    }

    public void setChannelLogo(ImageView imageView, String logoUrl) {
        Picasso.get().load(logoUrl).into(imageView);
    }

}
