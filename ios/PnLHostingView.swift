//
//  PnLHostingView.swift.swift
//  GrapheneTerminal
//
//  Created by Sergio Torres Landa González on 19/02/26.
//

import UIKit
import SwiftUI

// The @objc tag makes this class visible to our Objective-C++ files
@objc(PnLHostingView)
public class PnLHostingView: UIView {
    private var hostingController: UIHostingController<PnLView>?

    // This property acts as the listener. When JS sends a new prop, this triggers.
    @objc public var pnlValue: String = "" {
        didSet {
            updateView()
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }

    private func setupView() {
        // 1. Initialize the SwiftUI View
        let swiftUIView = PnLView(pnlValue: pnlValue)
        
        // 2. Wrap it in a Hosting Controller
        hostingController = UIHostingController(rootView: swiftUIView)

        guard let hostView = hostingController?.view else { return }
        hostView.translatesAutoresizingMaskIntoConstraints = false
        hostView.backgroundColor = .clear
        addSubview(hostView)

        // 3. Pin the SwiftUI view to the edges of our native UIView
        NSLayoutConstraint.activate([
            hostView.topAnchor.constraint(equalTo: topAnchor),
            hostView.bottomAnchor.constraint(equalTo: bottomAnchor),
            hostView.leadingAnchor.constraint(equalTo: leadingAnchor),
            hostView.trailingAnchor.constraint(equalTo: trailingAnchor)
        ])
    }

    private func updateView() {
        // When React Native sends a new pnlValue, we rebuild the SwiftUI tree
        hostingController?.rootView = PnLView(pnlValue: pnlValue)
    }
}
