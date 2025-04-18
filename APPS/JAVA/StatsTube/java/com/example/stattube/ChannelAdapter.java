package com.example.stattube;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.List;

public class ChannelAdapter extends BaseAdapter {

    private Context context;
    private List<String> channels;
    private LayoutInflater inflater;

    public ChannelAdapter(Context context, List<String> channels) {
        this.context = context;
        this.channels = channels;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return channels.size() / 3; // Each item in the list consists of three strings (title, ID, subscriber count)
    }

    @Override
    public Object getItem(int position) {
        return channels.get(position * 3);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.channels, parent, false);
        }

        TextView titleView = convertView.findViewById(R.id.text1);
        TextView subscribersView = convertView.findViewById(R.id.view_count);

        int index = position * 3;
        String title = channels.get(index);
        String id = channels.get(index + 1);
        String subscribers = channels.get(index + 2);

        titleView.setText(title);
        subscribersView.setText(formatCount(subscribers));

        // Set up the click listener for the item view
        convertView.setOnClickListener(v -> {
            Intent intent = new Intent(context, ChannelStastics.class);
            intent.putExtra("CHANNEL_ID", id);
            intent.putExtra("CHANNEL_NAME" , title);
            context.startActivity(intent);
        });

        return convertView;
    }

    public String formatCount(String Count) {
        try {
            int count = Integer.parseInt(Count);

            if (count >= 1_000_000) {
                return String.format("%.1fM", count / 1_000_000.0);
            } else if (count >= 1_000) {
                return String.format("%.1fK", count / 1_000.0);
            } else {
                return Count;
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return Count;
        }
    }
}
