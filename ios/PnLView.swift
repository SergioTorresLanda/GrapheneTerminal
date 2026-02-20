//
//  PnLView.swift
//  GrapheneTerminal
//
//  Created by Sergio Torres Landa González on 19/02/26.
//

import SwiftUI

struct PnLView: View {
    // This variable will receive the data from React Native
    var pnlValue: String
    
    var body: some View {
        Text(pnlValue)
            .font(.system(size: 24, weight: .bold, design: .monospaced))
            .foregroundColor(pnlValue.contains("-") ? .red : .green)
            .padding()
            .background(Color.black.opacity(0.8))
            .cornerRadius(8)
    }
}
