package com.example.stattube;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class VideoAdapter extends RecyclerView.Adapter<VideoAdapter.VideoViewHolder> {

    private Context context;
    private VideoInfo[] videoArray;


    public VideoAdapter(Context context, VideoInfo[] videoArray) {
        this.context = context;
        this.videoArray = videoArray;
    }

    @NonNull
    @Override
    public VideoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.video, parent, false);
        return new VideoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull VideoViewHolder holder, int position) {
        VideoInfo video = videoArray[position];

        // Bind data to views
        holder.title.setText(video.getTitle());
        holder.viewCount.setText(formatCount(video.getViewCount()));
        holder.likeCount.setText(formatCount(video.getLikeCount()));
        holder.commentCount.setText(formatCount(video.getCommentCount()));
        holder.timestamp.setText(formatTime(video.getPublishedAT()));

//         Load thumbnail image using Picasso
        Picasso.get()
                .load(video.getThumbnailUrl())
                .placeholder(R.drawable.ic_launcher_background) // Optional placeholder
                .into(holder.thumbnail);

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, VideoStatistics.class);
            intent.putExtra("VIDEO_ID", video.getVideoId());
            intent.putExtra("CHANNEL_VIEW", video.Channel_views);
            intent.putExtra("CHANNEL_SUBS", video.Channel_subs);
            intent.putExtra("CHANNEL_VIDS", video.Channel_vids);



            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return videoArray.length;
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



    public static class VideoViewHolder extends RecyclerView.ViewHolder {

        ImageView thumbnail;
        TextView title, viewCount, likeCount, commentCount , timestamp;

        public VideoViewHolder(@NonNull View itemView) {
            super(itemView);
            thumbnail = itemView.findViewById(R.id.Video_Thumbnail);
            title = itemView.findViewById(R.id.Video_Title);
            viewCount = itemView.findViewById(R.id.Video_Views);
            likeCount = itemView.findViewById(R.id.Video_likes);
            timestamp = itemView.findViewById(R.id.Video_timestap);
            commentCount = itemView.findViewById(R.id.Video_Comments);
        }
    }
}


