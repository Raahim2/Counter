package com.example.stattube;

import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.anychart.AnyChart;
import com.anychart.AnyChartView;
import com.anychart.chart.common.dataentry.DataEntry;
import com.anychart.chart.common.dataentry.ValueDataEntry;
import com.anychart.chart.common.listener.Event;
import com.anychart.chart.common.listener.ListenersInterface;
import com.anychart.charts.Cartesian;
import com.anychart.charts.Pie;
import com.anychart.core.cartesian.series.Column;
import com.anychart.enums.Align;
import com.anychart.enums.Anchor;
import com.anychart.enums.HoverMode;
import com.anychart.enums.LegendLayout;
import com.anychart.enums.Position;
import com.anychart.enums.TooltipPositionMode;
import com.google.android.material.tabs.TabLayout;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeRequestInitializer;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.squareup.picasso.Picasso;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public class VideoStatistics extends AppCompatActivity {
    private static final String APPLICATION_NAME = "My_First_Project";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final String API_KEY = "API_KEY";
    String VIDEO_ID;
    String CHANNEL_SUBS;
    String CHANNEL_VIEW;
    String CHANNEL_VIDS;


    ImageView THUMBNAIL;
    TextView VIDEO_TITLE;
    TextView VIDEO_PUB_DATE;
    TextView VIDEO_LIKES;
    TextView VIDEO_COMMENTS;
    TextView VIDEO_VIEWS;
    TextView LIKE_PER_VIEW;
    TextView COMMENT_PER_VIEW;
    TextView ENGAGEMENT_RATE;
    TabLayout tabLayout;

    TextView TEST1;
    TextView TEST2;
    TextView TEST3;
    TextView TEST4;
    TextView TEST5;
    TextView TOTAL;
    TextView GRADE;
    TextView PRECENTAGE;




    AnyChartView Chart1;
//    AnyChartView Chart2;
//    AnyChartView Chart3;

    TextView Status ;


    
    ConstraintLayout layout1;
    ConstraintLayout layout2;
    ConstraintLayout layout3;
    
    


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_video_statistics);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        Status = findViewById(R.id.chart1Title);
        
        layout1 = findViewById(R.id.video_statistics);
        layout2 = findViewById(R.id.graphical_analysis);
        layout3 = findViewById(R.id.rank_test);

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
        VIDEO_ID = intent.getStringExtra("VIDEO_ID");
        CHANNEL_SUBS = intent.getStringExtra("CHANNEL_SUBS");
        CHANNEL_VIDS = intent.getStringExtra("CHANNEL_VIDS");
        CHANNEL_VIEW = intent.getStringExtra("CHANNEL_VIEW");



        THUMBNAIL = findViewById(R.id.video_thumbnail);
        VIDEO_TITLE = findViewById(R.id.video_title);
        VIDEO_PUB_DATE = findViewById(R.id.publish_date);

        VIDEO_LIKES = findViewById(R.id.Likes_Count);
        VIDEO_COMMENTS = findViewById(R.id.Comments_Count);
        VIDEO_VIEWS = findViewById(R.id.Views_Count);

        LIKE_PER_VIEW = findViewById(R.id.like_per_view);
        COMMENT_PER_VIEW = findViewById(R.id.comment_per_view);
        ENGAGEMENT_RATE = findViewById(R.id.engagement_rate);

        TEST1 = findViewById(R.id.avgtestscore);
        TEST2 = findViewById(R.id.Liketest);
        TEST3 = findViewById(R.id.Commenttest);
        TEST4 = findViewById(R.id.subviewtest);
        TEST5 = findViewById(R.id.ertest);
        TOTAL = findViewById(R.id.total);
        PRECENTAGE = findViewById(R.id.Percentage);
        GRADE = findViewById(R.id.Grade);


        Chart1 = findViewById(R.id.chart1);
//        Chart2 = findViewById(R.id.chart2);
//        Chart3 = findViewById(R.id.chart3);




        //Tab Layout
        tabLayout = findViewById(R.id.tabLayout);
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(@NonNull TabLayout.Tab tab) {
                if(tab.getText().equals("Video Statistics")){
                    layout1.setVisibility(View.VISIBLE);
                    layout2.setVisibility(View.GONE);
                    layout3.setVisibility(View.GONE);
                } else if (tab.getText().equals("Graphical Analysis")) {
                    layout1.setVisibility(View.GONE);
                    layout2.setVisibility(View.VISIBLE);
                    layout3.setVisibility(View.GONE);

                }else {
                    layout1.setVisibility(View.GONE);
                    layout2.setVisibility(View.GONE);
                    layout3.setVisibility(View.VISIBLE);

                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
                // Do nothing
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                // Do nothing
            }
        });



        new VideoStats().execute();
    }


    private class VideoStats extends AsyncTask<String, Void, VideoInfo> {

        @Override
        protected VideoInfo doInBackground(String... strings) {
            YouTube youtube = getYouTubeService(API_KEY);
            try {

                YouTube.Videos.List request = youtube.videos().list("snippet,statistics");
                request.setId(VIDEO_ID);
                request.setKey(API_KEY);
                VideoListResponse response = request.execute();

                if (response.getItems().size() > 0) {
                    Video video = response.getItems().get(0);
                    String title = video.getSnippet().getTitle();
                    String thumbnail = video.getSnippet().getThumbnails().getHigh().getUrl();
                    String viewCount = video.getStatistics().getViewCount().toString();
                    String likeCount = video.getStatistics().getLikeCount().toString();
                    String commentCount = video.getStatistics().getCommentCount().toString();
                    String publishedAt = video.getSnippet().getPublishedAt().toString();


                    return new VideoInfo(title, viewCount, likeCount, commentCount, publishedAt, thumbnail , VIDEO_ID);
                } else {
                    return null;
                }

            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(VideoInfo video) {
            if (video != null) {
                try {

                    double Test1_score , Test2_score , Test3_score , Test4_score,Test5_score , Grand_Total;
                    long channel_avg_view = Long.parseLong(CHANNEL_VIEW)/Integer.parseInt(CHANNEL_VIDS);


                    double video_views = Integer.parseInt(video.getViewCount());
                    double video_likes = Integer.parseInt(video.getLikeCount());
                    double video_comments = Integer.parseInt(video.getCommentCount());
                    if(video_comments==0){
                        video_comments=1;
                    }
                    if(video_likes ==0){
                        video_likes=1;
                    }
                    if(video_views ==0){
                        video_views=1;
                    }


                    double engagement_rate = calculateEngagementRate(video.getLikeCount(),video.getCommentCount() ,video.getViewCount() );

                    //Tab 1
                    setImage(THUMBNAIL , video.VideoThumbnail);
                    VIDEO_TITLE.setText(video.getTitle());
                    VIDEO_VIEWS.setText(formatCount(video.getViewCount()));
                    VIDEO_LIKES.setText(formatCount(video.getLikeCount()));
                    VIDEO_COMMENTS.setText(formatCount(video.getCommentCount()));
                    VIDEO_PUB_DATE.setText(formatTime(video.getPublishedAT()) + " • Published");

                    LIKE_PER_VIEW.setText(calc(video.getLikeCount() , video.getViewCount()) + "%");
                    COMMENT_PER_VIEW.setText(calc(video.getCommentCount() , video.getViewCount()) + "%");
                    ENGAGEMENT_RATE.setText(engagement_rate+"%");

                    //Tab 2
                    Pie C1 = LikeCommentPie(20,30);
                    Chart1.setChart(C1);

                    //Tab 3

                    //Test1 -  Avg View Test
                    if(video_views>channel_avg_view){
                        Test1_score = 20;
                    }
                    else {
                        Test1_score = ((video_views/channel_avg_view)*20);
                    }

                    //Test2 -  LikeTest
                    if(video_likes>percentage(4 , video_views)){
                        Test2_score = 20;
                    }
                    else {
                        Test2_score = ((video_likes/(percentage(4,video_views)))*20);
                    }

                    //Test3 - Comment Test;
                    if(video_comments>percentage(0.2 , video_views)){
                        Test3_score = 20;
                    }
                    else {
                        Test3_score = ((video_comments/(percentage(0.2,video_views)))*20);
                    }

//                    Test 4 - Sub View Test
                    if(video_views > Integer.parseInt(CHANNEL_SUBS)){
                        Test4_score = 20;
                    }
                    else {
                        Test4_score =  (video_views/Integer.parseInt(CHANNEL_SUBS))*20;
                    }

                    //Test 5 - ER test (Engagemnet RATE)
                    if(engagement_rate>5){
                        Test5_score = 20;
                    }
                    else {
                        Test5_score = ((engagement_rate*4));
                    }


                    Grand_Total = roundOff(Test1_score) + roundOff(Test2_score) + roundOff(Test3_score) + roundOff(Test4_score) + roundOff(Test5_score);
                    handelColor(TEST1 , roundOff(Test1_score));
                    handelColor(TEST2 , roundOff(Test2_score));
                    handelColor(TEST3 , roundOff(Test3_score));
                    handelColor(TEST4 , roundOff(Test4_score));
                    handelColor(TEST5 , roundOff(Test5_score));

                    TEST1.setText(roundOff(Test1_score) + "/20");
                    TEST2.setText(roundOff(Test2_score)  + "/20");
                    TEST3.setText(roundOff(Test3_score)  + "/20");
                    TEST4.setText(roundOff(Test4_score) + "/20");
                    TEST5.setText(roundOff(Test5_score) + "/20");
                    TOTAL.setText(Grand_Total+"/100");
                    PRECENTAGE.setText(Grand_Total+"%");
                    String Grade;
                    int c;
                    if(Grand_Total  >80){
                        Grade = "A+";
                        c = Color.rgb(0, 100, 0);
                    } else if (80>Grand_Total && Grand_Total > 65) {
                        Grade ="B+";
                        c = Color.rgb(74,181,22);
                    } else if (65>Grand_Total && Grand_Total > 40) {
                        Grade ="C+";
                        c = (Color.rgb(241,236,14));
                    } else if (40>Grand_Total && Grand_Total > 25) {
                        Grade ="D+";
                        c =Color.rgb(255, 165, 0);
                    }else {
                        Grade = "F+";
                        c = Color.RED;
                    }
                    GRADE.setText(Grade);
                    GRADE.setTextColor(c);
                    PRECENTAGE.setTextColor(c);


                    ProgressBar Pb = findViewById(R.id.progressCircle);
                    Pb.setProgress((int) Grand_Total);


                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(VideoStatistics.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            } else {
                Toast.makeText(VideoStatistics.this, "Failed to fetch video statistics.", Toast.LENGTH_LONG).show();
            }
        }
    }

    public double percentage(double percent, double total) {
        return (percent / 100) * total;
    }
    public int roundOff(double number) {
        return (int) Math.ceil(number);
    }

    public  String calc(String numerator, String denominator) {
        BigDecimal num = new BigDecimal(numerator);
        BigDecimal denom = new BigDecimal(denominator);

        // Calculate percentage
        BigDecimal percentage = num.divide(denom, 10, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        // Round to 4 decimal places
        percentage = percentage.setScale(4, RoundingMode.HALF_UP);

        return percentage.toString();
    }

    public void handelColor(TextView text, int num) {
        if (num >= 1 && num <= 4) {
            text.setTextColor(Color.RED);
        } else if (num >= 5 && num <= 7) {
            text.setTextColor(Color.rgb(255, 165, 0)); //yellow
        } else if (num >= 8 && num <= 12) {
            text.setTextColor(Color.rgb(241,236,14)); //orange
        } else if (num >= 13 && num <= 16) {
            text.setTextColor(Color.rgb(74,181,22)); //green
        } else if (num >= 17 && num <= 20) {
            text.setTextColor(Color.rgb(0, 100, 0)); //daek green
        } else {
            text.setTextColor(Color.BLACK);
        }
    }


    public static double calculateEngagementRate(String likeCount, String commentCount, String viewCount) {
        BigDecimal likes = new BigDecimal(likeCount);
        BigDecimal comments = new BigDecimal(commentCount);
        BigDecimal views = new BigDecimal(viewCount);

        // Calculate engagement rate
        BigDecimal engagementRate = likes.add(comments)
                .divide(views, 10, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        // Round to 4 decimal places
        engagementRate = engagementRate.setScale(4, RoundingMode.HALF_UP);
        return engagementRate.doubleValue();
    }

    public static YouTube getYouTubeService(String apiKey) {
        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .setYouTubeRequestInitializer(new YouTubeRequestInitializer(apiKey))
                .build();
    }

    public void setImage(ImageView imageView, String Url) {
        Picasso.get().load(Url).into(imageView);
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
            // Handle the case where countStr is not a valid number
            e.printStackTrace();
            return countStr;
        }
    }

    public String formatTime(String time) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);
        inputFormat.setTimeZone(TimeZone.getTimeZone("UTC")); // Set timezone to UTC

        SimpleDateFormat outputFormat = new SimpleDateFormat("d MMMM yyyy", Locale.ENGLISH);

        try {
            Date date = inputFormat.parse(time);
            String formattedDate = outputFormat.format(date);
            return formattedDate;
        } catch (ParseException e) {
            e.printStackTrace();
            return time;
        }
    }




    public Pie LikeCommentPie(int like, int comment) {
        Pie pie = AnyChart.pie();

        pie.setOnClickListener(new ListenersInterface.OnClickListener(new String[]{"x", "value"}) {
            @Override
            public void onClick(Event event) {
                Toast.makeText(VideoStatistics.this, event.getData().get("x") + ":" + event.getData().get("value"), Toast.LENGTH_SHORT).show();
            }
        });

        List<DataEntry> data = new ArrayList<>();
        data.add(new ValueDataEntry("Likes", like));
        data.add(new ValueDataEntry("Comment", comment));

        pie.data(data);
        pie.title("Like Comment Ratio");
        pie.labels().position("outside");

        pie.legend().title().enabled(true);
        pie.legend().title()
                .text("Retail channels")
                .padding(0d, 0d, 10d, 0d);

        pie.legend()
                .position("center-bottom")
                .itemsLayout(LegendLayout.HORIZONTAL)
                .align(Align.CENTER);

        return pie;

    }

    public Cartesian ChannelStatsGraph(int view , int like  , int comment){
        Cartesian cartesian = AnyChart.column();

        List<DataEntry> data = new ArrayList<>();
        data.add(new ValueDataEntry("Views", view));
        data.add(new ValueDataEntry("Like", like));
        data.add(new ValueDataEntry("Comment", comment));



        Column column = cartesian.column(data);

        column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .format("${%Value}{groupsSeparator: }");

        cartesian.animation(true);
        cartesian.title("Channel Basic Statistics");

        cartesian.yScale().minimum(0d);

        cartesian.yAxis(0).labels().format("${%Value}{groupsSeparator: }");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Statistics");
        cartesian.yAxis(0).title("Count");


        return cartesian;

    }

    public void AvgVsView(VideoInfo video , int Channel_avg_view , AnyChartView chart){

        Cartesian cartesian = AnyChart.column();

        List<DataEntry> data = new ArrayList<>();
        data.add(new ValueDataEntry("View", Integer.parseInt(video.getViewCount())));
        data.add(new ValueDataEntry("Average View", Channel_avg_view));


        Column column = cartesian.column(data);

        column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .format("${%Value}{groupsSeparator: }");

        cartesian.animation(true);
        cartesian.title("Top 10 Cosmetic Products by Revenue");

        cartesian.yScale().minimum(0d);

        cartesian.yAxis(0).labels().format("${%Value}{groupsSeparator: }");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Product");
        cartesian.yAxis(0).title("Revenue");

        chart.setChart(cartesian);
    }


}



