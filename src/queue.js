"use strict";

function Queue(maxNumberOfNodes, nodeProcessor) {
    this.initialMaxNumberOfNodes = maxNumberOfNodes;
    this.nodeProcessor = nodeProcessor;
    this.reset(false);
}

Queue.prototype.reset = function() {
    this.maxNumberOfNodes = this.initialMaxNumberOfNodes;
    this.nodeProcessorIsActive = false;
    this.nodeProcessorIsTriggered = false;
    var allNodes = Array.prototype.concat(this.nodes, this.pendingNodes);
    this.nodes = [];
    this.pendingNodes = [];
    return allNodes;
};

Queue.prototype.renew = function() {
    return new Queue(this.initialMaxNumberOfNodes, this.nodeProcessor);
};

Queue.prototype.appendNode = function(node) {
    if (this.nodes.length < this.maxNumberOfNodes) {
        this.nodes.push(node);

        if (this.nodeProcessorIsActive) {
            this.triggerNodeProcessor();
        }
    } else {
        this.pendingNodes.push(node);
    }
};

Queue.prototype.removeNodes = function() {
    var nodes = this.nodes;
    this.nodes = [];
    this.maxNumberOfNodes -= nodes.length;
    return nodes;
}

Queue.prototype.commitNodeRemovals = function(numberOfNodes) {
    if (numberOfNodes < 1) {
        return;
    }

    this.maxNumberOfNodes += numberOfNodes;
    var n = this.maxNumberOfNodes - this.nodes.length;

    if (n >= 1 && this.pendingNodes.length >= 1) {
        var nodes = this.pendingNodes.slice(0, n);
        this.pendingNodes = this.pendingNodes.slice(n);
        Array.prototype.push.apply(this.nodes, nodes);

        if (this.nodeProcessorIsActive) {
            this.triggerNodeProcessor();
        }
    }
};

Queue.prototype.discardNodeRemovals = function(nodes) {
    if (nodes.length == 0) {
        return;
    }

    Array.prototype.unshift.apply(this.nodes, nodes);

    if (this.nodeProcessorIsActive) {
        this.triggerNodeProcessor();
    }
};

Queue.prototype.resumeNodeProcessor = function() {
    this.nodeProcessorIsActive = true;

    if (this.nodes.length >= 1) {
        this.triggerNodeProcessor();
    }
}

Queue.prototype.suspendNodeProcessor = function() {
    this.nodeProcessorIsActive = false;
}

Queue.prototype.triggerNodeProcessor = function() {
    if (!this.nodeProcessorIsTriggered) {
        this.nodeProcessorIsTriggered = true;

        setTimeout(function() {
            this.nodeProcessorIsTriggered = false;

            if (!this.nodeProcessorIsActive) {
                return;
            }

            var nodes = this.removeNodes();

            if (nodes.length == 0) {
                return;
            }

            this.nodeProcessor(nodes);
        }.bind(this), 0);
    }
};

module.exports = {
    Queue: Queue,
};
