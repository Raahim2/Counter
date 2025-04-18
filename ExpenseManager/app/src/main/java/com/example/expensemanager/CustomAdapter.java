package com.example.expensemanager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;

public class CustomAdapter extends RecyclerView.Adapter<CustomAdapter.ViewHolder> {

    private Expense[] localDataSet;

    public CustomAdapter(Expense[] dataSet) {
        localDataSet = dataSet;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView task;
        public TextView date;
        public TextView amt;
        public ImageView logo;

        public ViewHolder(View view) {
            super(view);
            task = view.findViewById(R.id.task);
            date = view.findViewById(R.id.date);
            amt = view.findViewById(R.id.amount);
            logo = view.findViewById(R.id.logo);
        }
    }

    public void updateExpenses(Expense[] newExpenses) {
        this.localDataSet = newExpenses;
        notifyDataSetChanged();
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.expense_layout, viewGroup, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, final int position) {
        Expense expense = localDataSet[position];
        viewHolder.task.setText(expense.getTask());
        viewHolder.date.setText(expense.getDate());
        viewHolder.amt.setText(String.valueOf(expense.getAmount()) + "₹");

        String type = expense.getType();

        if (type.equals("GROCERIES")){
            viewHolder.logo.setImageResource(R.drawable.food);
        }
        else if (type.equals("EDUCATION")){
            viewHolder.logo.setImageResource(R.drawable.edu);
        }
        else if (type.equals("TRANSPORT")){
            viewHolder.logo.setImageResource(R.drawable.transport);
        }
        else if (type.equals("MEDICAL")){
            viewHolder.logo.setImageResource(R.drawable.medical);
        }
        else if (type.equals("SALARY")){
            viewHolder.logo.setImageResource(R.drawable.salary);
        }
        else if (type.equals("RENT")){
            viewHolder.logo.setImageResource(R.drawable.rent);
        }
        else if (type.equals("BUSINESS")){
            viewHolder.logo.setImageResource(R.drawable.buisness);
        }
        else {
            viewHolder.logo.setImageResource(R.drawable.more);
        }

        
    }

    @Override
    public int getItemCount() {
        return localDataSet.length;
    }
}
