package com.example.stattube;

import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.material.textfield.TextInputEditText;
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
import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

public class DeepAnalysis extends AppCompatActivity {

    private static final String APPLICATION_NAME = "My_First_Project";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final String API_KEY = "API_KEY";
    private ArrayAdapter<String> adapter;
    private ArrayList<String> resultList = new ArrayList<>();
    private ArrayList<String> idList = new ArrayList<>();


    TextView Cname;
    TextView Csub;
    ImageView Clogo;
    TextView PERCENTAGE;
    TextView GRADE;

    ConstraintLayout layout1;
    ConstraintLayout layout2;
    ConstraintLayout layout3;
    ConstraintLayout layout4;
    ConstraintLayout head2;

    TextView cs;
    TextView ts;
    TextView tp;

    String channelName;
    String channelLogo;
    String channelSubs;
    String channelViews;
    String channelVids;
    String channelage;
    String channel2_id;




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_deep_analysis);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        layout1 = findViewById(R.id.video_statistics);
        layout2 = findViewById(R.id.rank_test);
        layout3 = findViewById(R.id.predict);
        layout4 = findViewById(R.id.compair);


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

        Intent intent = getIntent();
        String a = intent.getStringExtra("INFO");

        LinearLayout parentLinearLayout = findViewById(R.id.parentlayout);
        LinearLayout parent2 = findViewById(R.id.parent2);
        LayoutInflater inflater = LayoutInflater.from(this);

        channelName = intent.getStringExtra("CHANNEL_NAME");
        channelLogo = intent.getStringExtra("CHANNEL_LOGO");
        channelSubs = intent.getStringExtra("CHANNEL_SUBS");
        channelViews = intent.getStringExtra("CHANNEL_VIEWS");
        channelVids = intent.getStringExtra("CHANNEL_VIDS" );
        channelage = intent.getStringExtra("CHANNEL_AGE" );

        String[] LABELS = {
                "Total Views",
                "Total Videos",
                "Average Views",
                "Average Subscribers",
                "Views Per Subscribers",
                "Channel Age",
                "Views Per Day",
                "Subscribers Per Day",
                "Estimate Next Video in",
                "Impression"
        };

        String[] TEST_LABELS = {
                "Experience Test",
                "Average View Test",
                "Average Subscribers Test",
                "Views Per Subscribers Test",
                "Subscriber Test",
                "Grand Total"
        };


        Cname = findViewById(R.id.Channel_Name);
        Csub  = findViewById(R.id.Channel_Subscribers);
        Clogo = findViewById(R.id.Channel_Logo);

        Cname.setText(channelName);
        Csub.setText(formatCount(channelSubs));
        setChannelLogo(Clogo , channelLogo);


        if(a.equals("OP1")){
            layout1.setVisibility(View.VISIBLE);
            layout2.setVisibility(View.GONE);
            layout3.setVisibility(View.GONE);
            layout4.setVisibility(View.GONE);


            List<Object> valuesList = new ArrayList<>();
            valuesList.add(formatCount(channelViews));
            valuesList.add(formatCount(channelVids));
            valuesList.add(formatCount(String.valueOf(getAvg(channelViews , channelVids ))));

            valuesList.add(formatCount(String.valueOf(getAvg(channelSubs , channelVids ))));
            valuesList.add(formatCount(String.valueOf(getAvg(channelViews , channelSubs ))));
            valuesList.add(formatCount(channelage) + " DAYS");

            valuesList.add(formatCount(String.valueOf(getAvg(channelViews , channelage ))));
            valuesList.add(formatCount(String.valueOf(getAvg(channelSubs , channelage ))));
            valuesList.add(formatCount(String.valueOf(getAvg(channelage , channelVids ))) + " DAYS");
            valuesList.add(formatCount(String.valueOf(Long.parseLong(channelViews)*20)));

            for (int i = 0; i < LABELS.length; i++) {
                View itemView = inflater.inflate(R.layout.item_layout, parentLinearLayout, false);

                TextView textViewLeft = itemView.findViewById(R.id.textViewLeft);
                TextView textViewRight = itemView.findViewById(R.id.textViewRight);

                textViewLeft.setText(LABELS[i]);
                textViewRight.setText((String) valuesList.get(i));

                parentLinearLayout.addView(itemView);
            }

        }

        else if(a.equals("OP2")){
            layout1.setVisibility(View.GONE);
            layout2.setVisibility(View.VISIBLE);
            layout3.setVisibility(View.GONE);
            layout4.setVisibility(View.GONE);



            PERCENTAGE = findViewById(R.id.Percentage);
            GRADE = findViewById(R.id.Grade);

            List<Object> marks = new ArrayList<>();
            int marks1 , marks2 ,marks3 , marks4,marks5,total ;
            marks1 = test1(channelage);
            marks2 = test2n3(getAvg(channelViews , channelVids ) , getAvg(channelViews , channelage ));
            marks3 = test2n3(getAvg(channelSubs , channelVids ) , getAvg(channelSubs, channelage ));
            marks4 = test4(channelVids , getAvg(channelViews , channelSubs ) );
            marks5 = test5(channelSubs);
            total = marks1 + marks2 + marks3 + marks4 + marks5;

            marks.add(marks1 + "/20");
            marks.add(marks2 + " /20");
            marks.add(marks3 + "/20");
            marks.add(marks4 + "/20");
            marks.add(marks5 + "/20");
            marks.add(total + "/100");

            PERCENTAGE.setText(total+"%");
            String Grade;
            int c;
            if(total  >80){
                Grade = "A+";
                c = Color.rgb(0, 100, 0);
            } else if (80>total && total > 65) {
                Grade ="B+";
                c = Color.rgb(74,181,22);
            } else if (65>total && total > 40) {
                Grade ="C+";
                c = (Color.rgb(241,236,14));
            }else if (40>total && total > 25) {
                Grade ="D+";
                c =Color.rgb(255, 165, 0);
            }else {
                Grade = "F+";
                c = Color.RED;
            }

            GRADE.setText(Grade);
            GRADE.setTextColor(c);
            PERCENTAGE.setTextColor(c);


            ProgressBar Pb = findViewById(R.id.progressCircle);
            Pb.setProgress(total);


            for (int i = 0; i < TEST_LABELS.length; i++) {
                View itemView = inflater.inflate(R.layout.item_layout, parentLinearLayout, false);

                TextView textViewLeft = itemView.findViewById(R.id.textViewLeft);
                TextView textViewRight = itemView.findViewById(R.id.textViewRight);

                textViewLeft.setText(TEST_LABELS[i]);
                textViewRight.setText((String) marks.get(i));
//                handelColor(textViewRight , (int) marks.get(i));


                parent2.addView(itemView);
            }
        }

        else if(a.equals("OP3")){
            layout1.setVisibility(View.GONE);
            layout2.setVisibility(View.GONE);
            layout3.setVisibility(View.VISIBLE);
            layout4.setVisibility(View.GONE);

            cs = findViewById(R.id.cs);
            ts = findViewById(R.id.ts);
            tp = findViewById(R.id.tp);

            cs.setText(formatCount(channelSubs));

        }

        else if(a.equals("OP4")){
            layout1.setVisibility(View.GONE);
            layout2.setVisibility(View.GONE);
            layout3.setVisibility(View.GONE);
            layout4.setVisibility(View.VISIBLE);

            TextInputEditText searchEditText = findViewById(R.id.search_edit_text);
            ListView resultsList = findViewById(R.id.results_list);

            adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, resultList);
            resultsList.setAdapter(adapter);


            searchEditText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
                @Override
                public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                    if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                        idList.clear();
                        String query = searchEditText.getText().toString();
                        new FetchYouTubeChannelsTask().execute(query);
                        return true;
                    }
                    return false;
                }
            });

            resultsList.setOnItemClickListener((parent, view, position, id) -> {
//                String selectedItem = (String) parent.getItemAtPosition(position);
                head2 = findViewById(R.id.sec_channel);
                head2.setVisibility(View.VISIBLE);

                selectChannel(idList.get(position));
            });

        }



    }

    private class FetchYouTubeChannelsTask extends AsyncTask<String, Void, List<String>> {

        @Override
        protected List<String> doInBackground(String... queries) {
            String query = queries[0];
            List<String> resultList = new ArrayList<>();

            try {
                // Search for channels
                YouTube youtubeService = getYouTubeService(API_KEY);

                YouTube.Search.List searchRequest = youtubeService.search().list("snippet");
                searchRequest.setQ(query);
                searchRequest.setType("channel");
                searchRequest.setMaxResults(5L);
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
                        resultList.add(channelTitle + " - " + formatCount(subscriberCount.toString()) + " subscribers");
                        idList.add(searchResult.getId().getChannelId());
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return resultList;
        }

        @Override
        protected void onPostExecute(List<String> result) {
            resultList.clear();
            resultList.addAll(result);
            adapter.notifyDataSetChanged();
        }
    }

    private static class FetchChannel2Details extends AsyncTask<Void, Void, Channel> {
        private String channelId;
        private TextView nameView;
        private TextView subView;
        private ImageView logoView;

        public FetchChannel2Details(String channelId, TextView nameView, TextView subView, ImageView logoView) {
            this.channelId = channelId;
            this.nameView = nameView;
            this.subView = subView;
            this.logoView = logoView;
        }

        @Override
        protected Channel doInBackground(Void... voids) {
            try {

                YouTube youtubeService = getYouTubeService(API_KEY);
                YouTube.Channels.List request = youtubeService.channels()
                        .list("snippet,statistics")
                        .setId(channelId);
                ChannelListResponse response = request.execute();
                if (!response.getItems().isEmpty()) {
                    return response.getItems().get(0);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(Channel channel) {
            if (channel != null) {
                nameView.setText(channel.getSnippet().getTitle());
                subView.setText(formatCount(channel.getStatistics().getSubscriberCount().toString()));
                Picasso.get().load(channel.getSnippet().getThumbnails().getDefault().getUrl()).into(logoView);
            }
        }
    }

    public void compair(View v){
        Intent i = getIntent();
        String channel1_id = i.getStringExtra("CHANNEL_ID");
        Intent newIntent = new Intent(DeepAnalysis.this , CompairChannel.class);
        newIntent.putExtra("CHANNEL1_ID" , channel1_id);
        newIntent.putExtra("CHANNEL2_ID" , channel2_id);
        startActivity(newIntent);

    }

    public static YouTube getYouTubeService(String apiKey) {
        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                .build();
    }

    public void selectChannel(String id){
        TextView Channelname2  = findViewById(R.id.Channel_Name2);
        TextView ChannelSub2  = findViewById(R.id.Channel_Subscribers2);
        ImageView ChannelLogo2 = findViewById(R.id.Channel_Logo2);
        channel2_id = id;

        new FetchChannel2Details(id, Channelname2, ChannelSub2, ChannelLogo2).execute();

    }

    public void setChannelLogo(ImageView imageView, String logoUrl) {
        Picasso.get().load(logoUrl).into(imageView);
    }

    public void predict(View v){
        String target =  ts.getText().toString();
        String days = tp.getText().toString();

        TextView current = findViewById(R.id.current);
        current.setText(formatCount(channelSubs));

        TextView ans1 = findViewById(R.id.ans1);
        TextView ans2 = findViewById(R.id.ans2);

//        long remainingSubs = Long.parseLong(target) - Long.parseLong(channelSubs);
        long dailyIncrease = getAvg(channelSubs , channelage );

        long estimated_subs = (Long.parseLong(channelSubs) + (Integer.parseInt(days) * dailyIncrease));
        long estimated_days = (int) Math.ceil((double) Long.parseLong(target) / dailyIncrease);


        ans1.setText(formatDays((int) estimated_days) );
        ans2.setText(formatCount(String.valueOf(estimated_subs)) + " Subscribers");

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

    public static String formatDays(int numDays) {
        if (numDays < 0) {
            throw new IllegalArgumentException("Number of days must be non-negative");
        }

        int daysInMonth = 30;
        int daysInYear = 365;

        if (numDays < daysInMonth) {
            return numDays + " days";
        } else if (numDays < daysInYear) {
            int months = numDays / daysInMonth;
            int days = numDays % daysInMonth;
            return months + " months" + (days > 0 ? " and " + days + " days" : "");
        } else {
            int years = numDays / daysInYear;
            int remainingDays = numDays % daysInYear;
            int months = remainingDays / daysInMonth;
            int days = remainingDays % daysInMonth;
            return years + " years" + (months > 0 ? " and " + months + " months" : "") + (days > 0 ? " and " + days + " days" : "");
        }
    }

    public long getAvg(String a , String b){
        long ac = Long.parseLong(a);
        long bc = Long.parseLong(b);
        return  (ac / bc);
    }

    public int test1(String channelage) {
        int points = Integer.parseInt(channelage) / 60;
        return Math.min(points, 20);
    }

    public int test2n3(long avg, long per_day_avg) {
        if (avg > per_day_avg) {
            return 20;
        } else {
            return (int) Math.ceil(((double) avg / per_day_avg) * 20);
        }
    }


    public int test4(String view , long vps){
        double dv = Double.parseDouble(view);
        dv = dv/10;
        if(dv < vps){
            return 20;
        }
        else {
            return (int) Math.ceil(((double) vps/ dv)*20);
        }
    }

    public int test5(String subs){
        long num = Long.parseLong(subs);
        if(num > 25000000){
            return 20;
        }
        else {
            return (int) Math.ceil(((double) num / 25000000) * 20);
        }
    }








}
